import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType, useSearchParams } from "react-router";
import type { TripDraft, TripPlace } from "../types/trip";
import {
  DRAFT_KEY,
  basicError,
  placesError,
  readDraft,
  selectedPlaces,
} from "../utils/trip";
import { generateMockTrip } from "../data/mocks/tripService";
import { mockTripCities, mockTripPlaces } from "../data/mocks/tripData";
import { routes } from "../config/routes";
import { createGeneratedTrip, saveMockTrip } from "../data/mocks/mockTripService";
import { serverTripPlanPath, tripPlanPath } from "../utils/navigation";
import { createRequestLock } from "../utils/requestLock";
import { isServerTripId, tripDraftToApiInput } from "../api/adapters";
import { generateItinerary, getLatestItinerary } from "../api/itineraries";
import { ApiError } from "../api/client";
import { isApiEnabled } from "../api/config";
import { hasAuthSession } from "../api/tokenStorage";
import { confirmTrip, isMissingTrip } from "../api/trips";
import { saveFlights, saveRental, saveStays } from "../api/reservations";
import type { ReservationResponse, TripResponse } from "../api/types";
import { applyReservationsToDraft } from "../api/reservationAdapters";
import { apiTripToDraft } from "../utils/serverTrip";
import { isNewGeneratedItinerary } from "../utils/itineraryGeneration";
import useServerTripDraft from "./useServerTripDraft";

interface GenerationAttempt {
  previousVersion: number;
  startedAt: number;
}

const generationAttemptKey = (tripId: number) => `dotlo:generation-attempt:${tripId}`;

function readGenerationAttempt(tripId: number): GenerationAttempt | null {
  try {
    const stored = sessionStorage.getItem(generationAttemptKey(tripId));
    if (!stored) return null;
    const attempt = JSON.parse(stored) as GenerationAttempt;
    return Number.isInteger(attempt.previousVersion) && Number.isFinite(attempt.startedAt)
      ? attempt : null;
  } catch {
    return null;
  }
}

function saveGenerationAttempt(tripId: number, attempt: GenerationAttempt) {
  try { sessionStorage.setItem(generationAttemptKey(tripId), JSON.stringify(attempt)); } catch { /* 저장소를 사용할 수 없는 브라우저 */ }
}

function clearGenerationAttempt(tripId: number) {
  try { sessionStorage.removeItem(generationAttemptKey(tripId)); } catch { /* 저장소를 사용할 수 없는 브라우저 */ }
}

async function latestItineraryOrNone(tripId: number, signal: AbortSignal) {
  try {
    return await getLatestItinerary(tripId, signal);
  } catch (reason) {
    if (reason instanceof ApiError && reason.code === "ITINERARY_NOT_FOUND") return null;
    throw reason;
  }
}

function mayHaveFinishedOnServer(reason: unknown) {
  return reason instanceof TypeError || reason instanceof ApiError && [408, 502, 503, 504].includes(reason.status);
}

function initialDraft(
  trip?: TripResponse,
  places?: TripPlace[],
  reservations?: ReservationResponse,
  startNew = false,
): TripDraft {
  let saved: string | null = null;
  try {
    if (!startNew) saved = sessionStorage.getItem(DRAFT_KEY);
  } catch {
  }
  const draft = readDraft(saved);
  if (trip) {
    const resumed = applyReservationsToDraft(
      apiTripToDraft(trip, draft.tripId === String(trip.id) ? draft : undefined),
      reservations,
    );
    if (!places) return { ...resumed, selectedPlaceIds: [] };
    const placeIds = new Set(places.filter((place) => !place.closed && !place.needsMatch).map((place) => place.id));
    return {
      ...resumed,
      places,
      selectedPlaceIds: resumed.selectedPlaceIds.filter((id) => placeIds.has(id)),
      source: places.length ? "manual" : "none",
    };
  }
  try {
    const migrationKey = "dotlo:fukuoka-empty-saved:v1";
    if (!sessionStorage.getItem(migrationKey)) {
      if (draft.city === "후쿠오카" && draft.source === "mock") {
        draft.places = [];
        draft.selectedPlaceIds = [];
      }
      sessionStorage.setItem(migrationKey, "1");
    }
  } catch {
  }
  if (!isApiEnabled()) {
    if (!mockTripCities.some((city) => city.name === draft.city)) draft.city = "";
    draft.places = draft.places.map(
      (place) => mockTripPlaces.find((item) => item.id === place.id) ?? place,
    );
  }
  return { ...draft, tripId: draft.tripId || crypto.randomUUID() };
}
function useTripCreate(
  trip?: TripResponse,
  places?: TripPlace[],
  reservations?: ReservationResponse,
) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState(() => initialDraft(
    trip, places, reservations, !trip && navigationType === "PUSH" && location.state?.newAiTrip === true,
  ));
  const prepareServerTrip = useServerTripDraft(setDraft, !trip);
  const [isGenerating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [preparingTrip, setPreparingTrip] = useState(false);
  const recoverMissingDraft = useCallback((reason: unknown) => {
    if (trip || !isMissingTrip(reason)) return false;
    // A deleted draft's place IDs and generation attempt belong to the old trip.
    if (isServerTripId(draft.tripId)) clearGenerationAttempt(Number(draft.tripId));
    const localId = crypto.randomUUID();
    setDraft(current => ({ ...current, tripId: localId, places: [], selectedPlaceIds: [], source: "none" }));
    setError("");
    setParams({ step: "1" }, { replace: true });
    window.scrollTo(0, 0);
    return true;
  }, [trip, draft.tripId, setParams]);
  const request = useRef<AbortController | null>(null);
  const requestLock = useRef(createRequestLock());
  const requested = Number(params.get("step") || 1);
  const bounded = [1, 2, 3].includes(requested) ? requested : 1;
  const needsServerDraft = isApiEnabled() && hasAuthSession() && !isServerTripId(draft.tripId);
  const step = needsServerDraft || basicError(draft)
    ? 1
    : bounded === 3 && placesError(draft)
      ? 2
      : bounded;
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
    }
  }, [draft]);
  const generating = isGenerating && step === 3;
  useEffect(() => () => request.current?.abort(), [step]);
  useEffect(() => {
    if (step !== requested)
      setParams(trip ? { tripId: String(trip.id), step: String(step) } : { step: String(step) }, { replace: true });
  }, [step, requested, setParams, trip]);
  function update(next: TripDraft) {
    setDraft(next);
    setError("");
  }
  function move(next: number) {
    setParams(trip ? { tripId: String(trip.id), step: String(next) } : { step: String(next) });
    window.scrollTo(0, 0);
  }
  function back() {
    if (generating) return;
    if (step === 1) navigate(routes.home);
    else move(step - 1);
  }
  async function startPlacesStep() {
    if (preparingTrip) return;
    const input = tripDraftToApiInput(draft);
    if (!input) {
      setError(basicError(draft));
      return;
    }
    if (!isApiEnabled() || !hasAuthSession()) {
      move(2);
      return;
    }

    setPreparingTrip(true);
    setError("");
    try {
      const serverTripId = await prepareServerTrip(draft);
      if (draft.outbound?.apiFlight || draft.inbound?.apiFlight) {
        await saveFlights(
          serverTripId,
          draft.outbound?.apiFlight ?? null,
          draft.inbound?.apiFlight ?? null,
        );
      }
      if (draft.stays.length > 0 && draft.stays.every((stay) => stay.placeId)) {
        await saveStays(
          serverTripId,
          draft.stays.map((stay) => ({
            placeId: stay.placeId!,
            checkIn: stay.startDate,
            checkOut: stay.endDate,
          })),
        );
      }
      if (draft.rental?.placeId) {
        await saveRental(
          serverTripId,
          draft.rental.days,
          draft.rental.placeId,
        );
      }
      move(2);
    } catch (reason) {
      if (recoverMissingDraft(reason)) return;
      setError(
        reason instanceof Error
          ? reason.message
          : "여행 정보를 저장하지 못했어요. 다시 시도해 주세요.",
      );
    } finally {
      setPreparingTrip(false);
    }
  }
  async function generate(tripDraft = draft) {
    if (!requestLock.current.acquire()) return;
    const validation = basicError(tripDraft) || placesError(tripDraft);
    if (validation) {
      setError(validation);
      requestLock.current.release();
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setGenerating(true);
    setProgress(0);
    setError("");
    window.scrollTo(0, 0);
    let completed = false;
    try {
      if (isApiEnabled() && hasAuthSession()) {
        if (!isServerTripId(tripDraft.tripId)) throw new Error("여행 정보를 먼저 저장해 주세요.");
        const tripId = Number(tripDraft.tripId);
        const savedPlaceIds = selectedPlaces(tripDraft).map((place) => place.serverId ?? Number(place.id));
        if (savedPlaceIds.some((id) => !Number.isSafeInteger(id) || id < 1)) {
          throw new Error("저장 장소를 다시 선택해 주세요.");
        }
        setProgress(1);
        const finish = async (excludedPlaceIds?: string[], closedPlaceIds?: string[]) => {
          setProgress(3);
          clearGenerationAttempt(tripId);
          const confirmation = await confirmTrip(tripId, controller.signal).catch((reason: unknown) => {
            if (isMissingTrip(reason)) throw reason;
            return null;
          });
          if (controller.signal.aborted) return;
          completed = true;
          try {
            sessionStorage.removeItem(DRAFT_KEY);
          } catch {
            // 저장소를 사용할 수 없어도 생성한 일정으로 이동합니다.
          }
          navigate(serverTripPlanPath("generated", tripDraft.tripId), {
            replace: true,
            state: { excludedPlaceIds, closedPlaceIds, confirmation },
          });
        };

        const pending = readGenerationAttempt(tripId);
        if (pending) {
          const latest = await latestItineraryOrNone(tripId, controller.signal);
          if (isNewGeneratedItinerary(latest, pending.previousVersion)) {
            await finish();
            return;
          }
          if (Date.now() - pending.startedAt < 5 * 60_000) {
            setError("서버에서 일정 생성 결과를 확인 중이에요. 잠시 후 다시 누르면 새 요청 없이 결과를 확인해요.");
            return;
          }
          clearGenerationAttempt(tripId);
        }

        const previous = await latestItineraryOrNone(tripId, controller.signal);
        const attempt: GenerationAttempt = { previousVersion: previous?.version ?? 0, startedAt: Date.now() };
        saveGenerationAttempt(tripId, attempt);
        try {
          setProgress(2);
          const result = await generateItinerary(tripId, controller.signal, savedPlaceIds);
          if (controller.signal.aborted) return;
          await finish(result.excludedPlaceIds, result.closedPlaceIds);
        } catch (reason) {
          if (controller.signal.aborted) return;
          if (mayHaveFinishedOnServer(reason)) {
            try {
              const latest = await latestItineraryOrNone(tripId, controller.signal);
              if (isNewGeneratedItinerary(latest, attempt.previousVersion)) {
                await finish();
                return;
              }
            } catch (lookupError) {
              if (isMissingTrip(lookupError)) throw lookupError;
              // 결과 조회도 실패하면 다음 확인 때 같은 생성 요청을 보내지 않습니다.
            }
            setError("생성 결과를 아직 확인하지 못했어요. 잠시 후 다시 누르면 새 요청 없이 결과를 확인해요.");
            return;
          }
          clearGenerationAttempt(tripId);
          throw reason;
        }
        return;
      }
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await generateMockTrip(controller.signal, setProgress);
          break;
        } catch (reason) {
          if (controller.signal.aborted || attempt === 2) throw reason;
        }
      }
      if (controller.signal.aborted) return;
      completed = true;
      setProgress(4);
      saveMockTrip(createGeneratedTrip(tripDraft));
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // 저장소를 사용할 수 없어도 현재 여행 결과로 이동합니다.
      }
      navigate(tripPlanPath("generated", tripDraft.tripId), { replace: true });
    } catch (reason) {
      if (!controller.signal.aborted && !recoverMissingDraft(reason))
        setError(
          reason instanceof Error
            ? reason.message
            : "일정을 만들지 못했어요. 다시 시도해 주세요.",
        );
    } finally {
      if (request.current === controller) {
        request.current = null;
        if (!completed) setGenerating(false);
      }
      requestLock.current.release();
    }
  }
  const phases = [
    `저장한 장소 ${selectedPlaces(draft).length}곳 담기`,
    `${draft.preferences.tastes.join(", ") || "선택한 조건"} 순으로 취향 반영`,
    "날짜별 이동 거리와 시간 맞추기",
    "항공, 숙소에 맞춰 첫날과 마지막 날 정리",
  ];
  return {
    draft,
    step,
    generating,
    progress,
    error,
    preparingTrip,
    phases,
    update,
    move,
    back,
    prepareServerTrip,
    recoverMissingDraft,
    startPlacesStep,
    generate,
  };
}
export default useTripCreate;

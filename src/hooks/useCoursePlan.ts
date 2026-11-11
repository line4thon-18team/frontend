import { useEffect, useMemo, useRef, useState } from "react";
import { replacementPlaces, suggestedPlaces } from "../data/mocks/courseCompletionData";
import { mockTripPlaces } from "../data/mocks/tripData";
import { placeIcon, readMockTrip, readTripStorageNotice, saveMockTrip, tripStorageNotice } from "../data/mocks/mockTripService";
import { moveDayPlace } from "../utils/mockTrips";
import type { CourseCandidate, CoursePlanVariant, CourseScreen } from "../types/courseCompletion";
import type { MockTrip } from "../types/mockTrip";
import { requestMockAiEdit } from "../data/mocks/tripService";
import { createRequestLock } from "../utils/requestLock";

function useCoursePlan(tripId: string) {
  const [trip, setTrip] = useState(() => readMockTrip(tripId));
  const [activeDay, setActiveDay] = useState(0);
  const [screen, setScreen] = useState<CourseScreen>("plan");
  const [planVariant, setPlanVariant] = useState<CoursePlanVariant>("default");
  const [notice, setNotice] = useState(readTripStorageNotice);
  const [isSaved, setIsSaved] = useState(trip?.saved ?? false);
  const [aiRequest, setAiRequest] = useState("첫날은 좀 여유롭게, 카페는 빼도 괜찮아요");
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([]);
  const [replacementId, setReplacementId] = useState(201);
  const [replacementTargetId, setReplacementTargetId] = useState<number | null>(null);
  const [beforeAi, setBeforeAi] = useState<MockTrip | null>(null);
  const [isEditRequestPending, setEditRequestPending] = useState(false);
  const [editProgress, setEditProgress] = useState(0);
  const [editError, setEditError] = useState("");
  const editRequest = useRef<AbortController | null>(null);
  const editRequestLock = useRef(createRequestLock());
  const [removedPlaces, setRemovedPlaces] = useState<Array<{ day: number; place: MockTrip["days"][number]["places"][number] }>>([]);
  const places = trip?.days[activeDay]?.places ?? [];
  const selectedPlace = places.find((place) => place.id === selectedPlaceId);
  const candidates: CourseCandidate[] = useMemo(() => {
    if (trip?.city === "오사카") return suggestedPlaces;
    return mockTripPlaces.filter((place) => place.city === trip?.city).map((place, index) => ({
      id: 1001 + index, name: place.title, category: place.category,
      distance: place.description, image: place.image,
    }));
  }, [trip?.city]);
  const replacements = trip?.city === "오사카" ? replacementPlaces : candidates;
  const displayPlaces = screen === "ai-result" ? places.filter((place) => !place.category.includes("카페")) : places;

  useEffect(() => () => editRequest.current?.abort(), []);

  const updateTrip = (next: MockTrip, message: string) => {
    setTrip(next);
    setIsSaved(false);
    setNotice(saveMockTrip(next) ? message : tripStorageNotice);
  };

  const updatePlaces = (nextPlaces: typeof places, message: string) => {
    if (!trip) return;
    updateTrip({
      ...trip,
      days: trip.days.map((day, index) => index === activeDay ? { ...day, places: nextPlaces } : day),
    }, message);
  };

  const removePlace = (id: number) => {
    const place = places.find((item) => item.id === id);
    if (!place || place.fixed) return;
    setRemovedPlaces((current) => [...current, { day: activeDay, place }]);
    updatePlaces(places.filter((item) => item.id !== id), "일정에서 장소를 뺐어요.");
  };

  const addRemovedPlace = () => {
    const removed = removedPlaces.find((item) => item.day === activeDay);
    if (!removed) {
      setScreen("place-add");
      return;
    }
    updatePlaces([...places, removed.place], "장소를 일정에 다시 추가했어요.");
    setRemovedPlaces((current) => current.filter((item) => item !== removed));
  };

  const openPlaceDetail = (id: number) => {
    setSelectedPlaceId(id);
    setScreen("place-detail");
  };

  const removeSelectedPlace = () => {
    if (selectedPlace) removePlace(selectedPlace.id);
    setScreen("plan");
  };

  const toggleCandidate = (id: number) => {
    setSelectedCandidateIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const addSelectedCandidates = () => {
    if (!trip) return;
    const selected = candidates.filter((candidate) =>
      selectedCandidateIds.includes(candidate.id) && !places.some((place) => place.name === candidate.name),
    );
    const maxId = Math.max(0, ...trip.days.flatMap((day) => day.places.map((place) => place.id)),
      ...removedPlaces.map((item) => item.place.id));
    updatePlaces([...places, ...selected.map((candidate, index) => ({
      id: maxId + index + 1, name: candidate.name, category: candidate.category,
      detail: candidate.distance, image: candidate.image, icon: placeIcon(candidate.category),
    }))], `${selected.length}곳을 ${activeDay + 1}일차에 추가했어요.`);
    setSelectedCandidateIds([]);
    setScreen("schedule-edit");
  };

  const openReplacement = (id: number) => {
    setReplacementTargetId(id);
    setReplacementId(replacements[0]?.id ?? 201);
    setScreen("place-replace");
  };

  const applyReplacement = () => {
    const replacement = replacements.find((item) => item.id === replacementId);
    if (!replacement) return;
    updatePlaces(places.map((place) => place.id === replacementTargetId ? {
      ...place, name: replacement.name, image: replacement.image,
      category: replacement.category, icon: placeIcon(replacement.category),
      detail: replacement.distance, description: replacement.distance,
      latitude: undefined, longitude: undefined,
    } : place), `${replacement.name}(으)로 교체했어요.`);
    setScreen("schedule-edit");
  };

  const reorderPlace = (fromId: number, toId: number) => {
    if (!trip) return;
    updatePlaces(moveDayPlace(trip.days[activeDay], fromId, toId).places, "장소 순서를 변경했어요.");
  };

  const requestAiEdit = async () => {
    if (!trip || !aiRequest.trim() || !editRequestLock.current.acquire()) return;

    const controller = new AbortController();
    editRequest.current = controller;
    setEditRequestPending(true);
    setEditProgress(0);
    setEditError("");
    setScreen("ai-loading");

    try {
      await requestMockAiEdit(controller.signal, setEditProgress);
      if (controller.signal.aborted) return;
      setEditProgress(4);
      setScreen("ai-result");
    } catch (reason) {
      if (!controller.signal.aborted) {
        setEditError(
          reason instanceof Error
            ? reason.message
            : "일정을 수정하지 못했어요. 잠시 후 다시 시도해 주세요.",
        );
        setScreen("ai-edit");
      }
    } finally {
      if (editRequest.current === controller) {
        editRequest.current = null;
        setEditRequestPending(false);
      }
      editRequestLock.current.release();
    }
  };

  const applyAiResult = () => {
    if (!trip) return;
    setBeforeAi(trip);
    updatePlaces(displayPlaces, "수정한 일정을 적용했어요.");
    setPlanVariant("applied");
    setScreen("plan");
  };

  const undoAiResult = () => {
    if (!beforeAi) return;
    updateTrip(beforeAi, "AI 수정 전 일정으로 되돌렸어요.");
    setBeforeAi(null);
    setPlanVariant("default");
  };

  const savePlan = () => {
    if (!trip) return;
    const next = { ...trip, saved: true };
    if (!saveMockTrip(next)) {
      setNotice(tripStorageNotice);
      return;
    }
    setTrip(next);
    setIsSaved(true);
    setNotice(`${trip.title} 일정을 내 여행에 저장했어요.`);
  };

  const saveManualEdit = () => {
    savePlan();
    setScreen("plan");
  };

  return {
    trip, activeDay, aiRequest, candidates, replacements, displayPlaces, isSaved,
    isEditRequestPending, editProgress, editError,
    notice, places, planVariant, replacementId, screen, selectedCandidateIds,
    selectedPlace, removedPlaces: removedPlaces.filter((item) => item.day === activeDay),
    setActiveDay, setAiRequest, setReplacementId, setScreen, addRemovedPlace,
    addSelectedCandidates, applyAiResult, applyReplacement, openReplacement,
    openPlaceDetail, removePlace, removeSelectedPlace, reorderPlace,
    requestAiEdit, saveManualEdit, savePlan, toggleCandidate, undoAiResult,
  };
}

export default useCoursePlan;

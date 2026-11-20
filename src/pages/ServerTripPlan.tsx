import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ApiError } from "../api/client";
import ItineraryIssues from "../components/course-completion/ItineraryIssues";
import {
  applyItineraryEdit,
  getItineraryHistory,
  getLatestItinerary,
  requestItineraryEdit,
  saveItinerary,
} from "../api/itineraries";
import { getTripInteractions, type TripInteractions } from "../api/interactions";
import { addSavedPlace, getPlaceDetail, getSavedPlaces } from "../api/places";
import { getTripMembers } from "../api/members";
import { confirmTrip, getTrip } from "../api/trips";
import { getPlacePhoto } from "../api/placePhotos";
import type {
  ItineraryEditPreview,
  ItineraryVersionSummary,
  ItineraryVersionView,
  SavedPlaceResponse,
  MemberResponse,
  TripResponse,
} from "../api/types";
import { readPlanDay, readPlanOrigin, resumeTripPath, tripCommunityPath, tripPlanBackPath, tripSettingsPath } from "../utils/navigation";
import { apiTripToDraft, apiTripToSummary, companionLabels } from "../utils/serverTrip";
import { editItineraryPlace, type ItineraryPlaceEdit } from "../utils/itineraryPlaceEdits";
import { itineraryPlaceDetails, olderItinerary, type ItineraryPlaceDetails } from "../utils/itineraryPlaceDetails";
import { dateLabel, distanceLabel, durationLabel, placeAsObject, timeLabel } from "../utils/trip";
import { formatTripDetailDateRange, hasRegisteredImportedTrip, markImportedTripRegistered } from "../utils/importedTrip";
import DirectTripBuilder from "../components/direct-trip/DirectTripBuilder";
import CourseRouteMap from "../components/course-completion/CourseRouteMap";
import CourseMapScreen from "../components/traveler-course/CourseMapScreen";
import TripTimeline from "../components/course-completion/TripTimeline";
import PlaceDetail from "../components/course-completion/PlaceDetail";
import AddItineraryPlaceSheet from "../components/course-completion/AddItineraryPlaceSheet";
import ItineraryMovePlaceSheet from "../components/course-completion/ItineraryMovePlaceSheet";
import TravelModeSheet from "../components/course-completion/TravelModeSheet";
import AiEditSheet from "../components/course-completion/AiEditSheet";
import type { TravelLeg } from "../api/types";
import { travelModeLabels } from "../utils/trip";
import TripSummary from "../components/course-completion/TripSummary";
import TripInformationSheet from "../components/course-completion/TripInformationSheet";
import TripSheet from "../components/common/TripSheet";
import { RegisterBanner } from "./ImportedTripPage.styled";
import calendarIcon from "../assets/course-completion/icon-calendar.svg";
import backIcon from "../assets/course-completion/back.svg";
import cityPin from "../assets/direct-trip/city-pin.svg";
import settingsIcon from "../assets/course-completion/settings.svg";
import aiAvatar from "../assets/course-community/ai-avatar.png";
import addIcon from "../assets/icons/action-add.svg";
import checkIcon from "../assets/icons/status-selected-check.svg";
import addedCheckIcon from "../assets/course-completion/picker-added.svg";
import triangleIcon from "../assets/course-completion/triangle-down.svg";
import inviteIcon from "../assets/course-completion/invite-plus.svg";
import memberInviteIcon from "../assets/course-completion/member-invite-plus.svg";
import chatIcon from "../assets/course-community/chat.svg";
import { profileCharacter } from "../config/profileCharacters";
import { routes } from "../config/routes";
import { isMapCoordinate } from "../utils/googleMaps";

interface TripPlanData {
  trip: TripResponse;
  itinerary: ItineraryVersionView | null;
  places: SavedPlaceResponse[];
  placeDetails: ItineraryPlaceDetails[];
  history: ItineraryVersionSummary[];
  members: MemberResponse[];
  interactions?: TripInteractions;
}

// Keep the last server response while moving between the course and chat screens.
// A fresh request still runs on every mount, so this never becomes the source of truth.
const recentPlans = new Map<string, TripPlanData>();

function tripAccessDenied(reason: unknown) {
  return reason instanceof ApiError && (reason.status === 401 || reason.status === 403 || reason.code === "TRIP_NOT_FOUND");
}

const categoryLabels: Record<string, string> = {
  FOOD: "맛집",
  CAFE: "카페",
  SIGHTSEEING: "명소",
  SHOPPING: "쇼핑",
  NATURE: "자연",
  CULTURE: "문화",
  NIGHTLIFE: "야경",
  ACTIVITY: "체험",
  OTHER: "장소",
};

function travelDeparture(arrival: string, minutes: number) {
  const instant = Date.parse(`${arrival.slice(0, 19)}Z`);
  return Number.isFinite(instant) && Number.isFinite(minutes)
    ? new Date(instant - minutes * 60_000).toISOString().slice(0, 19)
    : undefined;
}

function ServerTripPlan({ tripId, userId }: { tripId: number; userId: number }) {
  const { search, state } = useLocation();
  const cacheKey = `${userId}:${tripId}`;
  const [data, setData] = useState<TripPlanData | undefined>(() => recentPlans.get(cacheKey));
  const [error, setError] = useState("");
  const [requestedDay, setActiveDay] = useState(() => readPlanDay(search) - 1);
  const activeDay = Math.min(requestedDay, Math.max(0, (data?.itinerary?.validation.days.length ?? 1) - 1));
  const [mapOpen, setMapOpen] = useState(false);
  const [mapDay, setMapDay] = useState<number>();
  const [photoPlace, setPhotoPlace] = useState<{ itemId: string; placeId: string; name: string }>();
  const [photoAction, setPhotoAction] = useState<"move" | "replace">();
  const courseReturnScroll = useRef<number | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [photoPending, setPhotoPending] = useState(false);

  const subScreen = photoPlace ? "place" : mapOpen ? "map" : null;
  useLayoutEffect(() => {
    if (subScreen) {
      window.scrollTo(0, 0);
    } else if (courseReturnScroll.current !== null) {
      window.scrollTo(0, courseReturnScroll.current);
      courseReturnScroll.current = null;
    }
  }, [subScreen]);
  const [interactionError, setInteractionError] = useState("");
  const interactionRequest = useRef(0);
  const [editing, setEditing] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [showAiEdit, setShowAiEdit] = useState(false);
  const [travelSelection, setTravelSelection] = useState<{
    date: string;
    targetItemId: string;
    from: string;
    to: string;
    fromCoordinate?: { latitude: number; longitude: number };
    toCoordinate?: { latitude: number; longitude: number };
    departAt?: string;
    travel: TravelLeg;
  }>();
  const [travelSaving, setTravelSaving] = useState(false);
  const [travelError, setTravelError] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editPreview, setEditPreview] = useState<ItineraryEditPreview>();
  const [editPending, setEditPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState(state?.courseImported === true ? "내 일정으로 가져왔어요" : "");
  const [placeAddNotice, setPlaceAddNotice] = useState("");
  const [addedPlaceIds, setAddedPlaceIds] = useState<ReadonlySet<string>>(() => new Set());
  const addPlaceButton = useRef<HTMLButtonElement>(null);
  const addPlaceScroll = useRef(0);
  const [inviteAccepted, setInviteAccepted] = useState(state?.inviteAccepted === true);
  const [confirmation, setConfirmation] = useState<Awaited<ReturnType<typeof confirmTrip>> | null | undefined>(
    state?.confirmation,
  );
  const [confirming, setConfirming] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(() => hasRegisteredImportedTrip(tripId));
  const [importedPhoto, setImportedPhoto] = useState<string | undefined>(state?.importedCoverImageUrl);
  const confirmationPending = useRef(false);
  const detailReadVersions = useRef(new Map<string, number>());

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadPlan() {
      try {
        const [trip, itinerary] = await Promise.all([getTrip(tripId, signal), getLatestItinerary(tripId, signal).catch((reason: unknown) => {
          if (reason instanceof ApiError && reason.code === "ITINERARY_NOT_FOUND") return null;
          throw reason;
        })]);
        if (signal.aborted) return;
        const [saved, history, members, interactions] = await Promise.all([
          itinerary ? getSavedPlaces(tripId, signal).catch((reason: unknown) => {
            if (tripAccessDenied(reason)) throw reason;
            return undefined;
          }) : Promise.resolve(undefined),
          itinerary ? getItineraryHistory(tripId, signal).catch(() => []) : Promise.resolve([]),
          getTripMembers(tripId, signal).catch((reason: unknown) => {
            if (tripAccessDenied(reason)) throw reason;
            return [];
          }),
          itinerary ? getTripInteractions(tripId, signal).catch(() => {
            if (!signal.aborted) setInteractionError("좋아요와 댓글을 불러오지 못했어요.");
            return undefined;
          }) : Promise.resolve(undefined),
        ]);
        if (!signal.aborted) {
          setData((current) => current && olderItinerary(itinerary, current.itinerary) ? current : {
            trip, itinerary, places: saved?.places ?? current?.places ?? [],
            placeDetails: current?.placeDetails ?? [], history, members, interactions,
          });
        }
      } catch (reason) {
        if (signal.aborted) return;
        if (tripAccessDenied(reason)) {
          recentPlans.delete(cacheKey);
          setData(undefined);
        }
        setError(reason instanceof ApiError && reason.code === "TRIP_NOT_FOUND"
          ? "여행을 찾지 못했어요."
          : "여행 일정을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    }

    void loadPlan();
    return () => controller.abort();
  }, [tripId, cacheKey]);

  useEffect(() => {
    if (data?.itinerary) recentPlans.set(cacheKey, data);
    else if (data) recentPlans.delete(cacheKey);
  }, [data, cacheKey]);

  const itinerary = data?.itinerary;
  const savedPlaces = data?.places;
  const placeDetails = data?.placeDetails;
  useEffect(() => {
    if (!itinerary || !savedPlaces || !placeDetails) return;
    const version = itinerary.version;
    const known = itineraryPlaceDetails(savedPlaces, placeDetails);
    const missing = new Set(itinerary.validation.days.flatMap((day) =>
      day.visits.map((visit) => visit.placeId).filter((id) => {
        const place = known.get(id);
        return detailReadVersions.current.get(id) !== version && (!place?.name || !isMapCoordinate(place));
      })));
    if (!missing.size) return;
    const controller = new AbortController();
    async function readDetails() {
      const fetched: ItineraryPlaceDetails[] = [];
      const ids = [...missing];
      for (let i = 0; i < ids.length && !controller.signal.aborted; i += 4) {
        const results = await Promise.allSettled(ids.slice(i, i + 4).map((id) => getPlaceDetail(tripId, id, controller.signal)));
        for (const result of results) {
          if (result.status === "fulfilled" && result.value?.placeId) fetched.push(result.value);
        }
      }
      if (controller.signal.aborted) return;
      for (const id of ids) detailReadVersions.current.set(id, version);
      if (!fetched.length) return;
      setData((current) => current && current.itinerary === itinerary
        ? { ...current, placeDetails: [...current.placeDetails, ...fetched] } : current);
    }
    void readDetails();
    return () => controller.abort();
  }, [tripId, itinerary, savedPlaces, placeDetails]);

  const summary = data && apiTripToSummary(data.trip);
  const hasNoItinerary = data?.itinerary === null;
  const days = data?.itinerary?.validation.days ?? [];
  const imported = data?.itinerary?.source === "COURSE_ADD" ||
    data?.history.some((item) => item.source === "COURSE_ADD") || state?.courseImported === true;
  const needsRegistration = imported && !registrationComplete && data?.trip.companion === "ALONE";
  const firstItinerarySource = data?.history.find((item) => item.version === 1)?.source ??
    (data?.itinerary?.version === 1 ? data.itinerary.source : undefined);
  const manuallyCreated = !imported && firstItinerarySource === "MANUAL_EDIT";
  const importedPlaceId = data?.itinerary?.draft.days.flatMap((item) => item.visits)[0]?.placeId;

  useEffect(() => {
    if (!imported || !importedPlaceId) return;
    let active = true;
    void getPlacePhoto(importedPlaceId, 0).then((photo) => {
      if (active && photo?.photoUrl) setImportedPhoto((current) => current || photo.photoUrl);
    }, () => undefined);
    return () => { active = false; };
  }, [imported, importedPlaceId]);

  useEffect(() => {
    if (!imported || !notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 4_000);
    return () => window.clearTimeout(timeout);
  }, [imported, notice]);

  useEffect(() => {
    if (!confirmation) return;
    const timeout = window.setTimeout(() => setConfirmation(undefined), 2_500);
    return () => window.clearTimeout(timeout);
  }, [confirmation]);

  useEffect(() => {
    if (!placeAddNotice) return;
    const footer = addPlaceButton.current?.closest("main")?.querySelector(".course-cta");
    (footer ?? addPlaceButton.current)?.scrollIntoView({ block: "end" });
    const timeout = window.setTimeout(() => setPlaceAddNotice(""), 4_000);
    return () => window.clearTimeout(timeout);
  }, [placeAddNotice]);

  const day = days[activeDay];
  const walkingMeters = day?.visits.reduce((sum, visit) =>
    sum + (visit.travel.mode === "WALK" ? visit.travel.distanceMeters : 0), 0) ?? 0;
  const origin = readPlanOrigin(search);
  const invitePath = `${tripSettingsPath(origin, undefined, tripId)}&panel=invite&day=${activeDay + 1}`;
  const backPath = origin === "generated" ? routes.myTrips : tripPlanBackPath(search);
  const placesById = itineraryPlaceDetails(data?.places ?? [], data?.placeDetails ?? []);
  const scheduledDays = new Map<string, number>();
  days.forEach((item, index) => item.visits.forEach(({ placeId }) => {
    if (!scheduledDays.has(placeId)) scheduledDays.set(placeId, index + 1);
  }));
  const placeCount = scheduledDays.size;
  const dayStops = day?.visits.flatMap(({ placeId }) => {
    const place = placesById.get(placeId);
    return place && isMapCoordinate(place) ? [{
      name: place.name, latitude: place.latitude, longitude: place.longitude,
    }] : [];
  }) ?? [];
  const courseMapDays = (mapOpen ? days : day ? [day] : []).map((item) => ({
    date: item.date,
    label: `${days.indexOf(item) + 1}일차`,
    places: item.visits.map((visit, index) => {
      const place = placesById.get(visit.placeId);
      const travel = item.visits[index + 1]?.travel;
      return {
        id: visit.itemId,
        order: index + 1,
        name: place?.name ?? "장소 정보 없음",
        photoPlaceId: visit.placeId,
        category: categoryLabels[place?.category ?? "OTHER"],
        latitude: place?.latitude ?? undefined,
        longitude: place?.longitude ?? undefined,
        travelTime: travel ? `${travelModeLabels[travel.mode]} ${travel.minutes}분` : undefined,
        distance: travel ? distanceLabel(travel.distanceMeters) : undefined,
        distanceMeters: travel?.distanceMeters,
      };
    }),
  }));
  const mapPlaces = courseMapDays[mapOpen ? activeDay : 0]?.places.filter(isMapCoordinate) ?? [];
  const excludedPlaceIds: string[] = Array.isArray(state?.excludedPlaceIds) ? state.excludedPlaceIds : [];
  const closedPlaceIds: string[] = Array.isArray(state?.closedPlaceIds) ? state.closedPlaceIds : [];
  const movementModes = new Set(days.flatMap((item) => item.visits
    .filter((visit) => visit.travel.distanceMeters > 0 || visit.travel.minutes > 0)
    .map((visit) => visit.travel.mode)));
  const movementLabel = movementModes.size === 0
    ? "이동 정보 없음"
    : [...movementModes].map((mode) => travelModeLabels[mode]).join(" · ");
  const shared = (data?.members.length ?? 0) > 1;

  function openCourseMap() {
    courseReturnScroll.current = window.scrollY;
    setMapDay(activeDay);
    setMapOpen(true);
  }

  function openPlace(itemId: string, placeId: string, name: string) {
    if (!mapOpen) courseReturnScroll.current = window.scrollY;
    setPhotoPlace({ itemId, placeId, name });
  }

  async function retryConfirmation() {
    if (!data?.itinerary || confirmationPending.current) return;
    confirmationPending.current = true;
    setConfirming(true);
    try {
      setConfirmation(await confirmTrip(tripId));
    } catch {
      setConfirmation(null);
    } finally {
      confirmationPending.current = false;
      setConfirming(false);
    }
  }

  const reloadHistory = async () => {
    const history = await getItineraryHistory(tripId);
    setData((current) => current ? { ...current, history } : current);
  };

  const applyTravelMode = async (mode: TravelLeg["mode"], all: boolean) => {
    if (!data?.itinerary || !travelSelection || travelSaving) return;
    setTravelSaving(true);
    setTravelError("");
    try {
      const days = data.itinerary.draft.days.map(({ date, visits }) => ({
        date,
        visits: visits.map((visit, index) =>
          index > 0 && (all || (date === travelSelection.date && visit.itemId === travelSelection.targetItemId))
            ? { ...visit, travelMode: mode }
            : visit),
      }));
      const itinerary = await saveItinerary(tripId, days, data.itinerary.version);
      setData((current) => current ? { ...current, itinerary } : current);
      setTravelSelection(undefined);
      setNotice("이동 수단을 저장했어요.");
      void reloadHistory().catch(() => undefined);
    } catch (reason) {
      setTravelError(reason instanceof Error ? reason.message : "이동 수단을 저장하지 못했어요.");
    } finally {
      setTravelSaving(false);
    }
  };

  const refreshInteractions = async () => {
    const request = ++interactionRequest.current;
    const interactions = await getTripInteractions(tripId);
    if (request !== interactionRequest.current) return;
    setData((current) => current ? { ...current, interactions } : current);
    setInteractionError("");
  };

  const commitPlaceEdit = async (edit: ItineraryPlaceEdit) => {
    if (!data?.itinerary || !photoPlace) return;
    const { itinerary: original } = data;
    const days = editItineraryPlace(original.draft.days, photoPlace.itemId, edit);
    const updatedPlaces = edit.kind === "replace" && !data.places.some((place) => place.placeId === edit.placeId && place.matchStatus === "MATCHED")
      ? (await addSavedPlace(tripId, edit.placeId)).places : undefined;
    let itinerary;
    try {
      itinerary = await saveItinerary(tripId, days, original.version);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409) {
        const latest = await getLatestItinerary(tripId).catch(() => undefined);
        if (latest) setData((current) => current && !olderItinerary(latest, current.itinerary)
          ? { ...current, itinerary: latest } : current);
        throw new Error("일정이 바뀌었어요. 최신 일정을 확인하고 다시 선택해 주세요.");
      }
      throw reason;
    }
    setData((current) => current ? { ...current, itinerary, places: updatedPlaces ?? current.places } : current);
    setPhotoAction(undefined);
    setPhotoPlace(undefined);
    if (edit.kind === "move") {
      setActiveDay(edit.day - 1);
      setMapDay(edit.day - 1);
      setNotice(`${edit.day}일차로 장소를 옮겼어요.`);
    } else {
      setNotice(edit.kind === "remove" ? `${placeAsObject(photoPlace.name)} 일정에서 뺐어요.` : "일정의 장소를 바꿨어요.");
    }
    void reloadHistory().catch(() => undefined);
    void refreshInteractions().catch(() => setInteractionError("일행 의견을 불러오지 못했어요."));
  };

  const changeSelectedPlace = async (edit: ItineraryPlaceEdit) => {
    if (!data?.itinerary || !photoPlace || photoPending) return;
    setPhotoPending(true);
    setPhotoError("");
    try {
      await commitPlaceEdit(edit);
    } catch (reason) {
      setPhotoError(reason instanceof Error ? reason.message : "장소 변경을 저장하지 못했어요.");
    } finally {
      setPhotoPending(false);
    }
  };

  const requestEdit = async () => {
    const message = editMessage.trim();
    if (!message || editPending) return;
    setEditPending(true);
    setActionError("");
    setNotice("");
    setEditPreview(undefined);
    try {
      setEditPreview(await requestItineraryEdit(tripId, message));
    } catch (reason) {
      setActionError(reason instanceof ApiError && reason.status === 500
        ? "AI가 수정안을 만들지 못했어요. 입력한 내용으로 다시 시도해 주세요."
        : reason instanceof Error ? reason.message : "수정안을 만들지 못했어요.");
    } finally {
      setEditPending(false);
    }
  };

  const applyEdit = async () => {
    if (!editPreview || editPending) return;
    setEditPending(true);
    setActionError("");
    try {
      const itinerary = await applyItineraryEdit(tripId, editPreview.editRequestId);
      setData((current) => current ? { ...current, itinerary } : current);
      setEditPreview(undefined);
      setEditMessage("");
      setShowAiEdit(false);
      setActiveDay(0);
      setNotice("");
      void reloadHistory().catch(() => undefined);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409 && reason.code === "ITINERARY_VERSION_CONFLICT") {
        setEditPreview(undefined);
        setActionError("일정이 변경되어 수정안을 적용하지 못했어요. 최신 일정을 확인하고 수정안을 다시 만들어 주세요.");
        try {
          const itinerary = await getLatestItinerary(tripId);
          setData((current) => current && !olderItinerary(itinerary, current.itinerary) ? { ...current, itinerary } : current);
          setActiveDay(0);
          void reloadHistory().catch(() => undefined);
        } catch {
          setActionError("최신 일정을 불러오지 못했어요. 여행 일정을 다시 열고 수정안을 만들어 주세요.");
        }
      } else if (reason instanceof ApiError && reason.status === 404 && reason.code === "EDIT_REQUEST_NOT_FOUND") {
        setEditPreview(undefined);
        setActionError("적용할 수정안을 찾지 못했어요. 입력한 내용으로 수정안을 다시 만들어 주세요.");
      } else {
        setActionError(reason instanceof Error ? reason.message : "수정안을 적용하지 못했어요.");
      }
    } finally {
      setEditPending(false);
    }
  };

  if (editing && data?.itinerary) {
    return (
      <DirectTripBuilder existing={{
        draft: apiTripToDraft(data.trip),
        days: data.itinerary.draft.days,
        validation: data.itinerary.validation,
        places: data.places,
        version: data.itinerary.version,
        initialDay: activeDay + 1,
        onSaved: (itinerary) => {
          setData((current) => current ? { ...current, itinerary, interactions: undefined } : current);
          setEditPreview(undefined);
          setActiveDay(0);
          setNotice("직접 편집한 일정을 저장했어요.");
          void reloadHistory().catch(() => undefined);
          void getSavedPlaces(tripId).then(({ places }) => {
            setData((current) => current?.itinerary?.version === itinerary.version
              ? { ...current, places }
              : current);
          }).catch(() => undefined);
        },
        onClose: () => {
          setEditing(false);
          void getLatestItinerary(tripId).then((itinerary) => {
            setData((current) => current && !olderItinerary(itinerary, current.itinerary) ? { ...current, itinerary } : current);
          }).catch(() => setActionError("최신 일정을 불러오지 못했어요. 여행 일정을 다시 열어 주세요."));
          void reloadHistory().catch(() => undefined);
          void refreshInteractions().catch(() => setInteractionError("일행 의견을 불러오지 못했어요."));
        },
      }} />
    );
  }

  if (photoPlace && data) {
    const savedPlace = placesById.get(photoPlace.placeId);
    const savedRecord = data.places.find((item) => item.placeId === photoPlace.placeId);
    const draftDays = data.itinerary?.draft.days ?? [];
    const placeDay = draftDays.findIndex((item) => item.visits.some((visit) => visit.itemId === photoPlace.itemId)) + 1;
    const currentMember = data.members.find((member) => member.me);
    const openPlaceAction = (action: "move" | "replace") => {
      setPhotoError("");
      setPhotoAction(action);
    };
    return <div className="course-page-shell"><div className="course-page">
      <PlaceDetail
        place={{
          id: savedRecord?.id ?? 0,
          name: savedPlace?.name ?? photoPlace.name,
          category: categoryLabels[savedPlace?.category ?? "OTHER"],
          detail: savedRecord?.note ?? savedPlace?.address ?? "",
          image: "",
          icon: "",
          latitude: savedPlace?.latitude ?? undefined,
          longitude: savedPlace?.longitude ?? undefined,
        }}
        onBack={() => { setPhotoPlace(undefined); setPhotoError(""); }}
        onRemove={() => void changeSelectedPlace({ kind: "remove" })}
        onMove={placeDay > 0 && draftDays.length > 1 ? () => openPlaceAction("move") : undefined}
        onReplace={placeDay > 0 ? () => openPlaceAction("replace") : undefined}
        removePending={photoPending}
        removeError={photoError}
        server={{ tripId, day: placeDay || undefined, itemId: photoPlace.itemId, placeId: photoPlace.placeId,
          interactions: data.interactions, loadError: interactionError, onRefresh: refreshInteractions,
          currentUserId: currentMember?.userId,
          currentCharacterId: currentMember?.characterId,
          onChange: (update) => {
            interactionRequest.current += 1;
            setData((current) => current?.interactions
              ? { ...current, interactions: update(current.interactions) } : current);
          } }}
      />
      {photoAction === "move" && <ItineraryMovePlaceSheet days={draftDays} currentDay={placeDay} placeId={photoPlace.placeId}
        pending={photoPending} error={photoError} onMove={(day) => void changeSelectedPlace({ kind: "move", day })}
        onClose={() => setPhotoAction(undefined)} />}
      {photoAction === "replace" && <AddItineraryPlaceSheet
        tripId={tripId} city={data.trip.city} day={placeDay} date={draftDays[placeDay - 1].date}
        anchor={savedPlace && isMapCoordinate(savedPlace) ? {
          name: savedPlace.name, latitude: savedPlace.latitude, longitude: savedPlace.longitude,
        } : undefined}
        scheduledDays={scheduledDays}
        replacement={{ category: savedPlace?.category ?? undefined,
          onSave: (placeId) => commitPlaceEdit({ kind: "replace", placeId, itemId: crypto.randomUUID() }),
        }}
        onClose={() => setPhotoAction(undefined)}
      />}
    </div></div>;
  }

  if (mapOpen && summary) {
    return <CourseMapScreen title={summary.title} city={summary.city} days={courseMapDays} tripId={tripId}
      activeDay={mapDay} onDayChange={setMapDay} onBack={() => setMapOpen(false)}
      onOpenPlace={(place) => {
        if (place.photoPlaceId) openPlace(String(place.id), place.photoPlaceId, place.name);
      }} />;
  }

  return (
    <div className="course-page-shell">
      <main className={`course-page server-trip-plan${hasNoItinerary ? " course-page--draft" : ""}`}>
        {data && summary && (
          <header className={`course-hero${imported ? " course-hero--imported" : ""}`}>
            {(importedPhoto || summary.coverImage) && <img className="course-hero__photo"
              src={importedPhoto || summary.coverImage} alt={`${summary.city} 여행`}
              onError={() => { if (importedPhoto) setImportedPhoto(undefined); }} />}
            <div className="course-hero__scrim" />
            <nav className="course-navigation" aria-label="코스 화면 탐색">
              <Link to={backPath} aria-label="뒤로 가기"><img src={backIcon} alt="" /></Link>
              <strong>{imported || hasNoItinerary ? "내 여행" : shared ? "함께하는 여행" : manuallyCreated ? "내 일정" : "AI 여행 코스"}</strong>
              {shared && (
                <Link to={tripCommunityPath(origin, undefined, tripId, activeDay + 1)} aria-label="함께하는 여행 채팅">
                  <img src={chatIcon} alt="" />
                </Link>
              )}
              <Link to={tripSettingsPath(origin, undefined, tripId)} aria-label="코스 설정">
                <img src={settingsIcon} alt="" />
              </Link>
            </nav>
            <div className="course-hero__title course-hero__title--with-action">
              <span><img src={cityPin} alt="" />{summary.city}</span>
              <h1>{summary.title}</h1>
              <p>
                {formatTripDetailDateRange(data.trip.startDate, data.trip.endDate)}
                {!needsRegistration && (
                  <>{" · "}{data.trip.companion === "ALONE" ? "혼자" : `${companionLabels[data.trip.companion]} ${data.trip.companionCount}명`}</>
                )}
              </p>
            </div>
            {data.members.length === 1 && (
              <Link className="course-hero__invite" to={invitePath}>
                <img src={inviteIcon} alt="" />친구 초대
              </Link>
            )}
            {shared && (
              <ul className="course-hero__members" aria-label={`함께하는 ${data.members.length}명`}>
                {data.members.slice(0, 3).map((member) => (
                  <li key={member.userId} title={member.name}>
                    <img src={profileCharacter(member.characterId).image} alt={member.name} />
                  </li>
                ))}
                <li className="course-hero__member-invite">
                  <Link to={invitePath} aria-label="친구 초대"><img src={memberInviteIcon} alt="" /></Link>
                </li>
              </ul>
            )}
          </header>
        )}
        <div className="course-content">
          {!data && error && <div className="course-plan-error" role="alert"><p>{error}</p><Link to={backPath}>내 여행으로 돌아가기</Link></div>}
          {actionError && <p role="alert">{actionError}</p>}
          {notice && !imported && <p role="status">{notice}</p>}
          {inviteAccepted && summary && (
            <div className="course-toast course-toast--invite" role="status">
              <img src={checkIcon} alt="" />
              <p>{summary.title}에 참여했어요.</p>
              <button type="button" onClick={() => setInviteAccepted(false)}>닫기</button>
            </div>
          )}
          {!data && !error && <p className="course-live-region" role="status">여행 일정을 불러오고 있어요.</p>}
          {data?.itinerary && summary && <RegisterBanner>
            <span><img src={calendarIcon} alt="" /></span>
            <strong>{needsRegistration ? "함께 가는 사람을 알려주세요" : "여행 날짜와 동행을 알려주세요"}</strong>
            <button type="button" onClick={() => setRegistrationOpen(true)}>
              {needsRegistration ? "등록하기" : "수정하기"}
            </button>
          </RegisterBanner>}
          {data && summary && (
            <section className="course-section">
              {data.itinerary && !imported && !manuallyCreated && <section className="ai-summary" aria-label="도틀로 AI 일정 구성 설명">
                <img src={aiAvatar} alt="도틀로 AI" />
                <div className="ai-summary__bubble">
                  <b>도틀로 AI의 일정 구성</b>
                  <p>{summary.durationLabel ?? "여행 기간"} 동안 {placeCount}곳을 방문하는 일정이에요.</p>
                </div>
              </section>}
              {data.itinerary && (
                <>
                  {confirmation === null && (
                    <div>
                      <p role={confirming ? "status" : "alert"}>
                        {confirming ? "일정을 확정하고 있어요." : "일정은 저장됐지만 확정을 완료하지 못했어요."}
                      </p>
                      <button type="button" className="course-inline-edit" disabled={confirming} onClick={() => void retryConfirmation()}>
                        확정 다시 시도
                      </button>
                    </div>
                  )}
                  <h2>일정</h2>
                  <TripSummary
                    duration={summary.durationLabel ?? durationLabel(data.trip.startDate, data.trip.endDate)}
                    placeCount={placeCount}
                    companion={movementLabel}
                    companionLabel="이동 방법"
                  />
                  {excludedPlaceIds.length > 0 && (
                    <section aria-label="일정에 넣지 못한 장소">
                      <p role="status">{excludedPlaceIds.length}곳은 일정에 넣지 못했어요.</p>
                      <ul>
                        {data.places.filter((place) => place.placeId && excludedPlaceIds.includes(place.placeId)).map((place) => (
                          <li key={place.id}>{place.name}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {closedPlaceIds.length > 0 && (
                    <section aria-label="영업하지 않아 제외된 장소">
                      <p role="status">{closedPlaceIds.length}곳은 여행 기간에 영업하지 않아 제외했어요.</p>
                      <ul>
                        {data.places.filter((place) => place.placeId && closedPlaceIds.includes(place.placeId)).map((place) => (
                          <li key={place.id}>{place.name}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  <div className="course-tabs" aria-label="여행 일차">
                    {days.map((item, index) => (
                      <button
                        key={item.date}
                        type="button"
                        className={activeDay === index ? "is-active" : ""}
                        aria-pressed={activeDay === index}
                        onClick={() => setActiveDay(index)}
                      >
                        <strong>{index + 1}일차</strong>
                        <span>{dateLabel(item.date).split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                  {day && day.visits.length > 0 && (
                    <button type="button" className="course-map-preview" aria-label={`${activeDay + 1}일차 지도 보기`} onClick={openCourseMap}>
                      <CourseRouteMap places={mapPlaces} city={summary.city} day={activeDay + 1} live />
                    </button>
                  )}
                  {day && <div className="day-course__header">
                    <h2>{activeDay + 1}일차 일정</h2>
                    <p><span>{day.visits.length}곳</span>{walkingMeters > 0 && <><i aria-hidden="true" /><span>도보 {distanceLabel(walkingMeters)}</span></>}</p>
                  </div>}
                  <TripTimeline day={activeDay + 1} shared={shared} onEdit={() => setEditing(true)} onOpenPlace={openPlace} visits={(day?.visits ?? []).map((visit, index, visits) => {
                    const place = placesById.get(visit.placeId);
                    const next = visits[index + 1];
                    const mode = next?.travel.mode;
                    const nextPlace = next && placesById.get(next.placeId);
                    return {
                      id: visit.itemId,
                      name: place?.name,
                      photoPlaceId: visit.placeId,
                      address: place?.address,
                      timing: `${timeLabel(visit.start)} – ${timeLabel(visit.end)}`,
                      category: categoryLabels[place?.category ?? "OTHER"],
                      added: addedPlaceIds.has(visit.placeId),
                      reactions: data.interactions ? data.interactions.items.find((item) => item.itemId === visit.itemId)
                        ?? { likeCount: 0, commentCount: 0 } : undefined,
                      connection: next && mode && (
                        <div className="travel-mode-connection">
                          <button type="button" aria-haspopup="dialog" onClick={() => setTravelSelection({
                            date: day!.date,
                            targetItemId: next.itemId,
                            from: place?.name ?? "이전 장소",
                            to: nextPlace?.name ?? "다음 장소",
                            fromCoordinate: typeof place?.latitude === "number" && typeof place.longitude === "number"
                              ? { latitude: place.latitude, longitude: place.longitude } : undefined,
                            toCoordinate: typeof nextPlace?.latitude === "number" && typeof nextPlace.longitude === "number"
                              ? { latitude: nextPlace.latitude, longitude: nextPlace.longitude } : undefined,
                            departAt: travelDeparture(next.arrival, next.travel.minutes),
                            travel: next.travel,
                          })}>
                            {travelModeLabels[mode]} {next.travel.minutes}분 <img src={triangleIcon} alt="" />
                          </button>
                          <small>{distanceLabel(next.travel.distanceMeters)}</small>
                        </div>
                      ),
                    };
                  })} />
                  {travelSelection && (
                    <TravelModeSheet
                      {...travelSelection}
                      tripId={tripId}
                      current={travelSelection.travel.mode}
                      saving={travelSaving}
                      error={travelError}
                      onClose={() => { setTravelSelection(undefined); setTravelError(""); }}
                      onApply={(mode, all) => void applyTravelMode(mode, all)}
                    />
                  )}
                  <button ref={addPlaceButton} type="button" className="add-place-button" disabled={!day || editPending} onClick={() => {
                    addPlaceScroll.current = window.scrollY;
                    window.scrollTo(0, 0);
                    setShowAddPlace(true);
                  }}><img src={addIcon} alt="" /> 장소 추가</button>
                  {showAddPlace && (
                    <AddItineraryPlaceSheet
                      tripId={tripId}
                      city={summary.city}
                      day={activeDay + 1}
                      date={day.date}
                      anchor={dayStops.at(-1)}
                      stops={dayStops}
                      scheduledDays={scheduledDays}
                      onClose={() => {
                        setShowAddPlace(false);
                        window.scrollTo(0, addPlaceScroll.current);
                      }}
                      onSaved={(itinerary, added, places, complete) => {
                        const addedIds = added.map((place) => place.placeId);
                        setData((current) => current && !olderItinerary(itinerary, current.itinerary) ? {
                          ...current, itinerary, places: places ?? current.places,
                          placeDetails: [...current.placeDetails, ...added],
                        } : current);
                        setAddedPlaceIds((current) => new Set([...current, ...addedIds]));
                        setEditPreview(undefined);
                        setActionError("");
                        if (complete) {
                          setShowAddPlace(false);
                          setPlaceAddNotice(`${addedIds.length}곳을 ${activeDay + 1}일차에 추가했어요`);
                        }
                        void reloadHistory().catch(() => undefined);
                        void refreshInteractions().catch(() => setInteractionError("일행 의견을 불러오지 못했어요."));
                      }}
                    />
                  )}
                </>
              )}
            </section>
          )}
        </div>
        {hasNoItinerary && data.members.some((member) => member.me && member.role === "OWNER") && (
          <div className="course-cta">
            <Link to={resumeTripPath(tripId)}>일정 등록하기</Link>
          </div>
        )}
        {data?.itinerary && data.members.length > 0 && (!manuallyCreated || shared) && (
          <div className="course-cta">
            {shared ? (
              <Link to={tripCommunityPath(origin, undefined, tripId, activeDay + 1)}>AI 수정 요청</Link>
            ) : (
              <button type="button" onClick={() => setShowAiEdit(true)}>AI 수정 요청</button>
            )}
          </div>
        )}
        {showAiEdit && !editPreview && <AiEditSheet
          value={editMessage}
          onChange={setEditMessage}
          onClose={() => setShowAiEdit(false)}
          onSubmit={() => void requestEdit()}
          pending={editPending}
          error={actionError}
        />}
        {showAiEdit && editPreview && <TripSheet title="수정안 확인" compactHeader courseHeight={593} closeDisabled={editPending}
          onClose={() => { setEditPreview(undefined); setShowAiEdit(false); }}
          footer={<div className="course-edit-preview-actions">
            <button className="course-edit-preview-keep" type="button" disabled={editPending}
              onClick={() => { setEditPreview(undefined); setShowAiEdit(false); }}>기존 일정 유지</button>
            <button className="course-sheet__primary" type="button" disabled={editPending} onClick={() => void applyEdit()}>
              {editPending ? "일정에 적용하고 있어요" : "이 일정 적용하기"}
            </button>
          </div>}>
          <div className="course-edit-preview">
            <p className="course-edit-preview-reason">{editPreview.reason}</p>
            <span>변경 {editPreview.diff.changes.length}건
              {editPreview.diff.reorderedDays.length > 0 && ` · 순서 변경 ${editPreview.diff.reorderedDays.length}일`}</span>
            {!editPreview.itinerary.validation.summary.valid && (
              <>
                <p>수정안에 확인이 필요한 일정이 있어요. 내용을 확인한 뒤 적용할 수 있어요.</p>
                <ItineraryIssues validation={editPreview.itinerary.validation} />
              </>
            )}
            {actionError && <p role="alert">{actionError}</p>}
          </div>
        </TripSheet>}
        {registrationOpen && data && <TripInformationSheet
          trip={data.trip}
          imported={imported}
          canChangeDates={hasNoItinerary}
          title={summary?.title ?? data.trip.city}
          movementLabel={movementLabel}
          mode={needsRegistration ? "register" : "edit"}
          onClose={() => setRegistrationOpen(false)}
          onSaved={(trip, registered) => {
            setData((current) => current ? { ...current, trip } : current);
            setRegistrationComplete(registered);
            setRegistrationOpen(false);
            setNotice("여행 정보를 저장했어요");
            if (imported && registered) markImportedTripRegistered(tripId);
          }}
        />}
        {placeAddNotice ? <div className="course-toast" role="status"><img src={addedCheckIcon} alt="" /><p>{placeAddNotice}</p></div>
          : imported && notice && <div className="course-toast" role="status"><img src={checkIcon} alt="" /><p>{notice}</p></div>}
        {confirmation && (
          <div className="course-toast course-toast--confirmation" role="status">
            <img src={checkIcon} alt="" />
            <p>코스가 완성돼서 내 여행에 저장했어요</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ServerTripPlan;

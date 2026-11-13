import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { ApiError } from "../api/client";
import {
  applyItineraryEdit,
  getItineraryHistory,
  getLatestItinerary,
  requestItineraryEdit,
  revertItinerary,
} from "../api/itineraries";
import { getSavedPlaces } from "../api/places";
import { getTrip } from "../api/trips";
import type {
  ItineraryEditPreview,
  ItineraryVersionSummary,
  ItineraryVersionView,
  SavedPlaceResponse,
  TripResponse,
} from "../api/types";
import { readPlanOrigin, resumeTripPath, tripCommunityPath, tripPlanBackPath, tripSettingsPath } from "../utils/navigation";
import { apiTripToDraft, apiTripToSummary } from "../utils/serverTrip";
import { dateLabel } from "../utils/trip";
import DirectTripBuilder from "../components/direct-trip/DirectTripBuilder";
import ItineraryIssues from "../components/course-completion/ItineraryIssues";
import CourseRouteMap from "../components/course-completion/CourseRouteMap";
import TripSheet from "../components/common/TripSheet";
import backIcon from "../assets/icons/nav-back.svg";
import settingsIcon from "../assets/course-completion/settings.svg";

interface TripPlanData {
  trip: TripResponse;
  itinerary: ItineraryVersionView | null;
  places: SavedPlaceResponse[];
  history: ItineraryVersionSummary[];
}

function timeLabel(value: string) {
  return (value.split("T")[1] ?? value).slice(0, 5);
}

const sourceLabels: Record<ItineraryVersionSummary["source"], string> = {
  AI_GENERATED: "AI 일정 생성",
  AI_EDITED: "AI 수정",
  MANUAL_EDIT: "직접 수정",
  COURSE_ADD: "코스 추가",
  REVERT: "되돌리기",
};

function ServerTripPlan({ tripId }: { tripId: number }) {
  const { search, state } = useLocation();
  const [data, setData] = useState<TripPlanData>();
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editPreview, setEditPreview] = useState<ItineraryEditPreview>();
  const [editPending, setEditPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [inviteAccepted, setInviteAccepted] = useState(state?.inviteAccepted === true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadPlan() {
      try {
        const trip = await getTrip(tripId, signal);
        if (signal.aborted) return;
        const itinerary = await getLatestItinerary(tripId, signal).catch((reason: unknown) => {
          if (reason instanceof ApiError && reason.code === "ITINERARY_NOT_FOUND") return null;
          throw reason;
        });
        if (signal.aborted) return;
        const saved = itinerary ? await getSavedPlaces(tripId, signal).catch(() => undefined) : undefined;
        const history = itinerary ? await getItineraryHistory(tripId, signal).catch(() => []) : [];
        if (!signal.aborted) setData({ trip, itinerary, places: saved?.places ?? [], history });
      } catch (reason) {
        if (signal.aborted) return;
        setError(reason instanceof ApiError && reason.code === "TRIP_NOT_FOUND"
          ? "여행을 찾지 못했어요."
          : "여행 일정을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    }

    void loadPlan();
    return () => controller.abort();
  }, [tripId]);

  const summary = data && apiTripToSummary(data.trip);
  const days = data?.itinerary?.validation.days ?? [];
  const day = days[activeDay];
  const origin = readPlanOrigin(search);
  const placesById = new Map(data?.places.map((place) => [place.placeId, place]));
  const placeCount = new Set(days.flatMap((item) => item.visits.map((visit) => visit.placeId))).size;
  const mapPlaces = (day?.visits ?? []).flatMap((visit, index) => {
    const place = placesById.get(visit.placeId);
    if (typeof place?.latitude !== "number" || typeof place.longitude !== "number" ||
      !Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) return [];
    return [{ id: visit.itemId, name: place.name, latitude: place.latitude, longitude: place.longitude, order: index + 1 }];
  });
  const excludedPlaceIds: string[] = Array.isArray(state?.excludedPlaceIds) ? state.excludedPlaceIds : [];

  const reloadHistory = async () => {
    const history = await getItineraryHistory(tripId);
    setData((current) => current ? { ...current, history } : current);
  };

  const requestEdit = async () => {
    const message = editMessage.trim();
    if (!message || editPending) return;
    setEditPending(true);
    setActionError("");
    setNotice("");
    try {
      setEditPreview(await requestItineraryEdit(tripId, message));
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "수정안을 만들지 못했어요.");
    } finally {
      setEditPending(false);
    }
  };

  const applyEdit = async () => {
    if (!editPreview || editPending) return;
    setEditPending(true);
    setActionError("");
    try {
      const itinerary = await applyItineraryEdit(tripId, editPreview.baseVersion);
      setData((current) => current ? { ...current, itinerary } : current);
      setEditPreview(undefined);
      setEditMessage("");
      setActiveDay(0);
      setNotice("수정한 일정을 적용했어요.");
      await reloadHistory();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "수정안을 적용하지 못했어요.");
    } finally {
      setEditPending(false);
    }
  };

  const revert = async (version: number) => {
    if (editPending) return;
    setEditPending(true);
    setActionError("");
    try {
      const itinerary = await revertItinerary(tripId, version);
      setData((current) => current ? { ...current, itinerary } : current);
      setActiveDay(0);
      setNotice(`${version}번 일정으로 되돌렸어요.`);
      await reloadHistory();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "일정을 되돌리지 못했어요.");
    } finally {
      setEditPending(false);
    }
  };

  if (editing && data?.itinerary) {
    return (
      <DirectTripBuilder existing={{
        draft: apiTripToDraft(data.trip),
        days: data.itinerary.draft.days,
        places: data.places,
        version: data.itinerary.version,
        onSaved: (itinerary) => {
          setData((current) => current ? { ...current, itinerary } : current);
          setActiveDay(0);
          setNotice("직접 편집한 일정을 저장했어요.");
          void reloadHistory();
        },
        onClose: () => setEditing(false),
      }} />
    );
  }

  return (
    <div className="course-page-shell">
      <main className="course-page">
        {data && summary && (
          <header className="course-hero server-course-hero">
            <nav className="course-navigation" aria-label="코스 화면 탐색">
              <Link to={tripPlanBackPath(search)} aria-label="뒤로 가기"><img src={backIcon} alt="" /></Link>
              <strong>내 여행 코스</strong>
              <Link to={tripSettingsPath(origin, undefined, tripId)} aria-label="코스 설정">
                <img src={settingsIcon} alt="" />
              </Link>
            </nav>
            <p className="server-course-hero__placeholder">이미지 없음</p>
            <div className="course-hero__title">
              <span>{summary.city}</span>
              <h1>{summary.title}</h1>
              <p>{summary.dateLabel}</p>
            </div>
          </header>
        )}
        <div className="course-content">
          {!data && <Link to={tripPlanBackPath(search)}>여행 목록으로 돌아가기</Link>}
          {error && <p role="alert">{error}</p>}
          {actionError && <p role="alert">{actionError}</p>}
          {notice && <p role="status">{notice}</p>}
          {inviteAccepted && summary && (
            <div className="course-toast course-toast--invite" role="status">
              <span aria-hidden="true">✓</span>
              <p>{summary.title} 여행에 참여했어요.</p>
              <button type="button" onClick={() => setInviteAccepted(false)}>닫기</button>
            </div>
          )}
          {!data && !error && <p role="status">여행 일정을 불러오고 있어요.</p>}
          {data && summary && (
            <section className="course-section">
              <div className="server-course-summary">
                <p>AI 요약 문장 없음</p>
                <ul aria-label="여행 요약">
                  <li><strong>{summary.durationLabel}</strong><small>여행 기간</small></li>
                  <li><strong>{placeCount}곳</strong><small>일정에 담긴 장소</small></li>
                  <li><strong>{apiTripToDraft(data.trip).companion} {data.trip.companionCount}명</strong><small>동행</small></li>
                </ul>
              </div>
              <Link to={tripCommunityPath(origin, "osaka", tripId)}>공동 계획 데모 열기</Link>
              {data.itinerary ? (
                <>
                  <h2>일정</h2>
                  <button type="button" className="course-inline-edit" onClick={() => setEditing(true)}>일정 직접 편집하기</button>
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
                  <ItineraryIssues validation={data.itinerary.validation} />
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
                        <span>{dateLabel(item.date)}</span>
                      </button>
                    ))}
                  </div>
                  {day && (mapPlaces.length ? (
                    <>
                      <CourseRouteMap places={mapPlaces} city={summary.city} day={activeDay + 1} schematic />
                      <button type="button" className="course-inline-edit" onClick={() => setMapExpanded(true)}>지도 확대</button>
                    </>
                  ) : <p>이날 지도에 표시할 장소 좌표가 없어요.</p>)}
                  {mapExpanded && mapPlaces.length > 0 && (
                    <TripSheet title={`${activeDay + 1}일차 지도`} onClose={() => setMapExpanded(false)}>
                      <CourseRouteMap places={mapPlaces} city={summary.city} day={activeDay + 1} schematic expanded />
                    </TripSheet>
                  )}
                  {day?.visits.length ? (
                    <ol className="server-course-timeline" aria-label={`${activeDay + 1}일차 장소 타임라인`}>
                      {day.visits.map((visit) => {
                        const place = placesById.get(visit.placeId);
                        return (
                          <li key={visit.itemId}>
                            <strong>{place?.name ?? "장소 정보 없음"}</strong>
                            {place?.address && <small>{place.address}</small>}
                            <p>
                              {timeLabel(visit.start)} – {timeLabel(visit.end)}
                              {" · 이동 "}{visit.travel.minutes}분
                              {["ESTIMATED", "ROUTE_NOT_FOUND"].includes(visit.travel.source) && " (추정)"}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  ) : <p>이날 일정에 담긴 장소가 없어요.</p>}
                  <section aria-labelledby="ai-edit-title">
                    <h2 id="ai-edit-title">AI로 일정 수정하기</h2>
                    <textarea
                      value={editMessage}
                      maxLength={500}
                      onChange={(event) => setEditMessage(event.target.value)}
                      placeholder="예: 2일차 점심을 빼고 오사카성을 넣어줘"
                      aria-label="AI 일정 수정 요청"
                    />
                    <button
                      type="button"
                      disabled={!editMessage.trim() || editPending}
                      onClick={() => void requestEdit()}
                    >
                      {editPending && !editPreview ? "수정안을 만들고 있어요" : "수정안 확인하기"}
                    </button>
                    {editPreview && (
                      <div>
                        <h3>수정안</h3>
                        <p>{editPreview.reason}</p>
                        <p>
                          변경 {editPreview.diff.changes.length}건
                          {editPreview.diff.reorderedDays.length > 0 &&
                            ` · 순서 변경 ${editPreview.diff.reorderedDays.length}일`}
                        </p>
                        <button type="button" disabled={editPending} onClick={() => void applyEdit()}>
                          {editPending ? "적용하고 있어요" : "이 일정 적용하기"}
                        </button>
                        <button type="button" disabled={editPending} onClick={() => setEditPreview(undefined)}>
                          기존 일정 유지
                        </button>
                      </div>
                    )}
                  </section>
                  {data.history.length > 0 && (
                    <section aria-labelledby="history-title">
                      <h2 id="history-title">일정 변경 이력</h2>
                      <ul>
                        {data.history.map((item) => (
                          <li key={item.version}>
                            <span>{sourceLabels[item.source]} · {new Date(item.createdAt).toLocaleString("ko-KR")}</span>
                            {item.version !== data.itinerary?.version && (
                              <button type="button" disabled={editPending} onClick={() => void revert(item.version)}>
                                이 버전으로 되돌리기
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              ) : (
                <>
                  <p>아직 저장된 일정이 없어요.</p>
                  <Link to={resumeTripPath(tripId)}>일정 만들기</Link>
                </>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default ServerTripPlan;

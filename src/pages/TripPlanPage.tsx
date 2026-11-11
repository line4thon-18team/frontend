import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import AiEditLoading from "../components/course-completion/AiEditLoading";
import AiEditSheet from "../components/course-completion/AiEditSheet";
import CourseHero from "../components/course-completion/CourseHero";
import CourseEditSheet from "../components/course-completion/CourseEditSheet";
import CourseOverview from "../components/course-completion/CourseOverview";
import DayCourse from "../components/course-completion/DayCourse";
import PlaceDetail from "../components/course-completion/PlaceDetail";
import PlacePickerSheet from "../components/course-completion/PlacePickerSheet";
import "../components/course-completion/CourseCompletion.css";
import "../components/course-completion/CourseEdit.css";
import useCoursePlan from "../hooks/useCoursePlan";
import { readMockTrips } from "../data/mocks/mockTripService";
import acceptedCheckIcon from "../assets/invite/accepted-check.svg";
import {
  readPlanOrigin,
  tripCommunityPath,
  tripPlanBackPath,
  tripSettingsPath,
  importedTripPath,
} from "../utils/navigation";

function TripPlanPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const legacyTrip = readPlanOrigin(location.search) === "generated"
    ? readMockTrips().find((trip) => trip.source === "generated" && !trip.saved)
    : undefined;
  const tripId = params.get("course") ?? legacyTrip?.id ?? "osaka";
  return <CoursePlan key={tripId} tripId={tripId} />;
}

function CoursePlan({ tripId }: { tripId: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const planOrigin = readPlanOrigin(location.search);
  const inviteAccepted = new URLSearchParams(location.search).get("invite") === "accepted";
  const {
    trip,
    candidates,
    replacements,
    activeDay,
    aiRequest,
    displayPlaces,
    isSaved,
    isEditRequestPending,
    editProgress,
    editError,
    notice,
    places,
    planVariant,
    removedPlaces,
    replacementId,
    screen,
    selectedCandidateIds,
    selectedPlace,
    setActiveDay,
    setAiRequest,
    setReplacementId,
    setScreen,
    addRemovedPlace,
    addSelectedCandidates,
    applyAiResult,
    applyReplacement,
    openReplacement,
    reorderPlace,
    openPlaceDetail,
    removePlace,
    removeSelectedPlace,
    requestAiEdit,
    saveManualEdit,
    savePlan,
    toggleCandidate,
    undoAiResult,
  } = useCoursePlan(tripId);

  useEffect(() => {
    if (["place-detail", "ai-loading", "ai-result"].includes(screen)) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [screen]);

  if (!trip) {
    return <main className="course-page"><p role="status">여행을 찾지 못했어요. 저장된 여행 목록을 확인해 주세요.</p><button type="button" onClick={() => navigate("/my-trips")}>내 여행 보기</button></main>;
  }

  if (screen === "place-detail" && selectedPlace) {
    return (
      <div className="course-page-shell">
        <div className="course-page">
          <PlaceDetail
            place={selectedPlace}
            onBack={() => setScreen("plan")}
            onRemove={removeSelectedPlace}
          />
        </div>
      </div>
    );
  }

  if (screen === "ai-loading") {
    return (
      <div className="course-page-shell">
        <div className="course-page" aria-busy={isEditRequestPending}>
          <AiEditLoading day={activeDay + 1} progress={editProgress} />
        </div>
      </div>
    );
  }

  const overviewVariant =
    screen === "ai-result"
      ? "result"
      : planVariant === "applied"
        ? "applied"
        : "default";

  return (
    <div className="course-page-shell">
      <main className="course-page">
        <CourseHero
          trip={trip}
          variant={overviewVariant === "default" ? "default" : "ai"}
          onBack={() => navigate(tripPlanBackPath(location.search))}
          onOpenSettings={() => navigate(tripSettingsPath(planOrigin, trip.id))}
        />

        <div className="course-content">
          {notice && <p role="status">{notice}</p>}
          {trip.source === "imported" && !trip.startDate && (
            <button type="button" onClick={() => navigate(importedTripPath(trip.id))}>여행 날짜와 동행 등록하기</button>
          )}
          <CourseOverview
            trip={trip}
            places={displayPlaces}
            activeDay={activeDay}
            onDayChange={setActiveDay}
            variant={overviewVariant}
          />
          <DayCourse
            dayLabel={`${activeDay + 1}일차 ${trip.city} 일정`}
            places={displayPlaces}
            variant={overviewVariant}
            unplacedCount={overviewVariant === "default" ? removedPlaces.length : 0}
            onAddPlace={() => setScreen("place-add")}
            onEditPlace={() => setScreen("schedule-edit")}
            onOpenPlace={openPlaceDetail}
            onRemovePlace={removePlace}
            onRestorePlace={addRemovedPlace}
          />
        </div>

        <div className="course-cta">
          {screen === "ai-result" ? (
            <>
              <div className="course-cta__row">
                <button className="is-secondary" type="button" onClick={() => setScreen("ai-edit")}>다시 수정</button>
                <button type="button" onClick={applyAiResult}>이 일정 적용하기</button>
              </div>
              <button className="course-cta__link" type="button" onClick={() => setScreen("plan")}>기존 일정 보기</button>
            </>
          ) : planVariant === "applied" ? (
            <div className="course-cta__row">
              <button className="is-secondary" type="button" onClick={() => setScreen("schedule-edit")}>일정 수정</button>
              <button type="button" onClick={savePlan} disabled={isSaved}>
                {isSaved ? "저장 완료" : "내 여행에 저장하기"}
              </button>
            </div>
          ) : (
            <div className="course-cta__row">
              <button className="is-secondary" type="button" onClick={() => navigate(tripCommunityPath(planOrigin, trip.id))}>AI 수정 요청</button>
              <button type="button" onClick={savePlan} disabled={isSaved}>{isSaved ? "저장 완료" : "내 여행에 저장하기"}</button>
            </div>
          )}
        </div>
        {planVariant === "applied" && screen === "plan" && (
          <div className="course-toast" role="status"><span>✓</span><p>수정한 일정을 적용했어요</p><button type="button" onClick={undoAiResult}>되돌리기</button></div>
        )}
        {inviteAccepted && screen === "plan" && (
          <div className="course-toast course-toast--invite" role="status">
            <img src={acceptedCheckIcon} alt="" />
              <p>{trip.title} 여행에 참여했어요</p>
          </div>
        )}

        {screen === "ai-edit" && (
          <AiEditSheet
            value={aiRequest}
            onChange={setAiRequest}
            onClose={() => setScreen("plan")}
            onSubmit={() => void requestAiEdit()}
            error={editError}
          />
        )}
        {screen === "schedule-edit" && (
          <CourseEditSheet
            days={trip.days}
            activeDay={activeDay}
            onDayChange={setActiveDay}
            onReorder={reorderPlace}
            places={places}
            onAdd={() => setScreen("place-add")}
            onClose={() => setScreen("plan")}
            onRemove={removePlace}
            onReplace={openReplacement}
            onSave={saveManualEdit}
          />
        )}
        {screen === "place-add" && (
          <PlacePickerSheet
            candidates={candidates}
            day={activeDay + 1}
            mode="add"
            replacementId={replacementId}
            selectedIds={selectedCandidateIds}
            onClose={() => setScreen("schedule-edit")}
            onConfirm={addSelectedCandidates}
            onSelectReplacement={setReplacementId}
            onToggle={toggleCandidate}
          />
        )}
        {screen === "place-replace" && (
          <PlacePickerSheet
            candidates={replacements}
            day={activeDay + 1}
            mode="replace"
            replacementId={replacementId}
            selectedIds={selectedCandidateIds}
            onClose={() => setScreen("schedule-edit")}
            onConfirm={applyReplacement}
            onSelectReplacement={setReplacementId}
            onToggle={toggleCandidate}
          />
        )}
      </main>
    </div>
  );
}

export default TripPlanPage;

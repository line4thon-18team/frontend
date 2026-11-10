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
import acceptedCheckIcon from "../assets/invite/accepted-check.svg";
import {
  readPlanOrigin,
  tripCommunityPath,
  tripPlanBackPath,
  tripSettingsPath,
} from "../utils/navigation";

function TripPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const planOrigin = readPlanOrigin(location.search);
  const inviteAccepted = new URLSearchParams(location.search).get("invite") === "accepted";
  const {
    activeDay,
    aiRequest,
    displayPlaces,
    isSaved,
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
    openPlaceDetail,
    removePlace,
    removeSelectedPlace,
    saveManualEdit,
    savePlan,
    toggleCandidate,
    undoAiResult,
  } = useCoursePlan();

  useEffect(() => {
    if (screen !== "ai-loading") return;
    const timer = window.setTimeout(() => setScreen("ai-result"), 1300);
    return () => window.clearTimeout(timer);
  }, [screen, setScreen]);

  useEffect(() => {
    if (["place-detail", "ai-loading", "ai-result"].includes(screen)) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [screen]);

  if (screen === "place-detail") {
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
        <div className="course-page">
          <AiEditLoading onBack={() => setScreen("ai-edit")} />
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
          variant={overviewVariant === "default" ? "default" : "ai"}
          onBack={() => navigate(tripPlanBackPath(location.search))}
          onOpenSettings={() => navigate(tripSettingsPath(planOrigin))}
        />

        <div className="course-content">
          <CourseOverview
            activeDay={activeDay}
            onDayChange={setActiveDay}
            variant={overviewVariant}
          />
          <DayCourse
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
            <button type="button" onClick={() => navigate(tripCommunityPath(planOrigin))}>AI 수정 요청</button>
          )}
        </div>
        {planVariant === "applied" && screen === "plan" && (
          <div className="course-toast" role="status"><span>✓</span><p>수정한 일정을 적용했어요</p><button type="button" onClick={undoAiResult}>되돌리기</button></div>
        )}
        {inviteAccepted && screen === "plan" && (
          <div className="course-toast course-toast--invite" role="status">
            <img src={acceptedCheckIcon} alt="" />
            <p>오사카 3박 4일 여행에 참여했어요</p>
          </div>
        )}
        <p className="course-live-region" aria-live="polite">
          {notice}
        </p>

        {screen === "ai-edit" && (
          <AiEditSheet
            value={aiRequest}
            onChange={setAiRequest}
            onClose={() => setScreen("plan")}
            onSubmit={() => setScreen("ai-loading")}
          />
        )}
        {screen === "schedule-edit" && (
          <CourseEditSheet
            places={places}
            onAdd={() => setScreen("place-add")}
            onClose={() => setScreen("plan")}
            onRemove={removePlace}
            onReplace={() => setScreen("place-replace")}
            onSave={saveManualEdit}
          />
        )}
        {screen === "place-add" && (
          <PlacePickerSheet
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

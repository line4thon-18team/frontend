import { useLocation, useNavigate } from "react-router";
import backIcon from "../assets/course-settings/back.svg";
import CourseSettingsMenu from "../components/course-settings/CourseSettingsMenu";
import CourseSettingsSheet from "../components/course-settings/CourseSettingsSheet";
import { CourseSettingsConfirmDialog, CourseSettingsDetailView } from "../components/course-settings/CourseSettingsDetails";
import useCourseSettings from "../hooks/useCourseSettings";
import { useEffect, useState } from "react";
import * as S from "../components/course-settings/CourseSettings.styled";
import { settingsBackPath } from "../utils/navigation";
import { readMockScenario } from "../utils/mockScenario";
import { routes } from "../config/routes";
import type { CourseSettingsDialog, CourseSettingsView } from "../types/courseSettings";

function CourseSettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showUnsavedMock =
    readMockScenario(location.search) === "settings-unsaved-close";
  const [view, setView] = useState<CourseSettingsView>("menu");
  const [dialog, setDialog] = useState<CourseSettingsDialog>(null);
  const [selectedCover, setSelectedCover] = useState(0);
  const [tripDays, setTripDays] = useState(3);
  const {
    activeSheet,
    tripName,
    draftName,
    isDirty,
    isEditingName,
    copied,
    notice,
    nameInputRef,
    setDraftName,
    setNotice,
    openSheet,
    closeSheet,
    startEditingName,
    saveTripName,
    saveAndCloseTripSheet,
    cancelNameEdit,
    copyInviteLink,
  } = useCourseSettings(
    showUnsavedMock
      ? {
          initialSheet: "trip",
          initialDraftName: "오사카 우정 여행",
        }
      : {},
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view]);

  const openInviteFromMembers = () => {
    setView("menu");
    openSheet("invite");
  };

  const confirmAction = () => {
    if (dialog === "delete") {
      setDialog(null);
      navigate(routes.myTrips, { state: { courseDeleted: true } });
      return;
    }
    setDialog(null);
    setNotice("코스를 내 여행에 복제했어요.");
  };

  return (
    <S.PageShell>
      <S.Page>
        {view === "menu" ? <><S.Navigation aria-label="코스 설정 탐색">
          <button
            type="button"
            aria-label="이전 화면으로 이동"
            onClick={() => navigate(settingsBackPath(location.search))}
          >
            <img src={backIcon} alt="" />
          </button>
          <h1>코스 설정</h1>
          <span aria-hidden="true" />
        </S.Navigation>

        <CourseSettingsMenu
          onOpenSheet={openSheet}
          onOpenMembers={() => setView("members")}
          onOpenNotifications={() => setView("notifications")}
          onOpenClone={() => setDialog("clone")}
          onOpenDelete={() => setDialog("delete")}
          onOpenOrigin={() => navigate("/courses/kyoto-walk")}
        />
        <S.LiveRegion aria-live="polite">{notice}</S.LiveRegion>
        <S.HomeIndicator />
        </> : (
          <CourseSettingsDetailView view={view} onBack={() => setView("menu")} onInvite={openInviteFromMembers} />
        )}

        {activeSheet && (
          <CourseSettingsSheet
            activeSheet={activeSheet}
            tripName={tripName}
            draftName={draftName}
            isDirty={isDirty}
            isEditingName={isEditingName}
            copied={copied}
            nameInputRef={nameInputRef}
            onDraftNameChange={setDraftName}
            onStartEditingName={startEditingName}
            onSaveTripName={saveTripName}
            onSaveAndClose={saveAndCloseTripSheet}
            onDiscardAndClose={closeSheet}
            onCancelNameEdit={cancelNameEdit}
            onCopyInviteLink={copyInviteLink}
            onNotice={setNotice}
            onClose={closeSheet}
            initialCloseConfirm={showUnsavedMock}
            selectedCover={selectedCover}
            tripDays={tripDays}
            onCoverChange={setSelectedCover}
            onSaveCover={() => {
              setNotice("대표 이미지를 변경했어요.");
              closeSheet();
            }}
            onTripDaysChange={setTripDays}
            onSaveDuration={() => {
              setNotice(`여행 기간을 ${tripDays - 1}박 ${tripDays}일로 변경했어요.`);
              closeSheet();
            }}
          />
        )}
        {dialog && <CourseSettingsConfirmDialog dialog={dialog} onCancel={() => setDialog(null)} onConfirm={confirmAction} />}
      </S.Page>
    </S.PageShell>
  );
}

export default CourseSettingsPage;

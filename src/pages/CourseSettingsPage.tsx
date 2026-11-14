import { useLocation, useNavigate } from "react-router";
import backIcon from "../assets/course-settings/back.svg";
import shareIcon from "../assets/course-settings/link.svg";
import memberIcon from "../assets/course-settings-details/menu-members.svg";
import deleteIcon from "../assets/course-settings-details/menu-delete.svg";
import chevronIcon from "../assets/figma/settings-chevron.svg";
import { isServerTripId } from "../api/adapters";
import { getTripMembers, leaveTrip } from "../api/members";
import { deleteTrip, getTrip } from "../api/trips";
import type { MemberResponse, TripResponse } from "../api/types";
import { apiTripToSummary } from "../utils/serverTrip";
import CourseSettingsMenu from "../components/course-settings/CourseSettingsMenu";
import ServerInviteSheet from "../components/course-settings/ServerInviteSheet";
import CourseSettingsSheet from "../components/course-settings/CourseSettingsSheet";
import { CourseSettingsConfirmDialog, CourseSettingsDetailView } from "../components/course-settings/CourseSettingsDetails";
import useCourseSettings from "../hooks/useCourseSettings";
import { useEffect, useRef, useState } from "react";
import * as S from "../components/course-settings/CourseSettings.styled";
import { settingsBackPath } from "../utils/navigation";
import { readMockScenario } from "../utils/mockScenario";
import { routes } from "../config/routes";
import type { CourseSettingsDialog, CourseSettingsView } from "../types/courseSettings";
import { readMockTrip, saveMockTrip } from "../data/mocks/mockTripService";

function CourseSettingsPage() {
  const { search } = useLocation();
  const tripId = new URLSearchParams(search).get("returnTripId");
  if (tripId && isServerTripId(tripId)) {
    return <ServerCourseSettings key={tripId} tripId={Number(tripId)} />;
  }
  return <DemoCourseSettings />;
}

function ServerCourseSettings({ tripId }: { tripId: number }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [data, setData] = useState<{ trip: TripResponse; members: MemberResponse[] }>();
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [showMembers, setShowMembers] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [dialog, setDialog] = useState<"delete" | "leave">();
  const [actionError, setActionError] = useState("");
  const [pending, setPending] = useState(false);
  const actionPending = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    void Promise.all([getTrip(tripId, signal), getTripMembers(tripId, signal)]).then(
      ([trip, members]) => {
        if (!signal.aborted) setData({ trip, members });
      },
      () => {
        if (!signal.aborted) setLoadError("여행 설정을 불러오지 못했어요. 다시 시도해 주세요.");
      },
    );
    return () => controller.abort();
  }, [tripId, attempt]);

  const currentMember = data?.members.find((member) => member.me);
  const owner = currentMember?.role === "OWNER";
  const summary = data && apiTripToSummary(data.trip);
  const leaveMessage = owner
    ? data?.members.length === 1
      ? "혼자 참여한 여행이라 나가면 여행이 삭제돼요."
      : "먼저 참여한 멤버에게 방장이 넘어가고, 나는 여행에서 나가요."
    : "나간 뒤에는 여행을 볼 수 없어요. 다시 참여하려면 초대 링크가 필요해요.";

  function openDialog(action: "delete" | "leave") {
    setActionError("");
    setDialog(action);
  }

  async function confirmAction() {
    if (!dialog || !currentMember || (dialog === "delete" && !owner) || actionPending.current) return;
    actionPending.current = true;
    setPending(true);
    setActionError("");
    try {
      let tripDeleted = dialog === "delete";
      if (tripDeleted) await deleteTrip(tripId);
      else tripDeleted = (await leaveTrip(tripId)).tripDeleted;
      navigate(`${routes.myTrips}?toast=${tripDeleted ? "trip-deleted" : "trip-left"}`, { replace: true });
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "요청을 처리하지 못했어요. 다시 시도해 주세요.");
      setPending(false);
      actionPending.current = false;
    }
  }

  return (
    <S.PageShell>
      <S.Page>
        {showMembers && data ? (
          <CourseSettingsDetailView view="members" members={data.members} onBack={() => setShowMembers(false)} onInvite={() => setShowInvite(true)} />
        ) : (
          <>
            <S.Navigation aria-label="코스 설정 탐색">
              <button type="button" aria-label="이전 화면으로 이동" onClick={() => navigate(settingsBackPath(search))}>
                <img src={backIcon} alt="" />
              </button>
              <h1>코스 설정</h1>
              <span aria-hidden="true" />
            </S.Navigation>
            <S.SettingsContent>
              {loadError ? (
                <>
                  <p role="alert">{loadError}</p>
                  <button type="button" onClick={() => {
                    setLoadError("");
                    setAttempt((value) => value + 1);
                  }}>다시 시도</button>
                </>
              ) : !data || !summary ? <p role="status">여행 설정을 불러오고 있어요.</p> : (
                <>
                  <S.SettingsSection aria-label="여행 정보">
                    <h2>여행 정보</h2>
                    <strong>{summary.title}</strong>
                    <p>{summary.dateLabel}</p>
                  </S.SettingsSection>
                  <S.Divider />
                  <S.SettingsSection aria-label="함께하기">
                    <h2>함께하기</h2>
                    <S.MenuList>
                      <S.MenuButton type="button" onClick={() => setShowInvite(true)}>
                        <img src={memberIcon} alt="" />
                        <span>친구 초대</span>
                        <S.Chevron src={chevronIcon} alt="" />
                      </S.MenuButton>
                      <S.MenuButton type="button" onClick={() => setShowMembers(true)}>
                        <img src={memberIcon} alt="" />
                        <span>멤버 관리</span>
                        <S.MenuMeta>{data.members.length}명</S.MenuMeta>
                        <S.Chevron src={chevronIcon} alt="" />
                      </S.MenuButton>
                      {data.trip.status === "CONFIRMED" && (
                        <S.MenuButton type="button" onClick={() => setShowShare(true)}>
                          <img src={shareIcon} alt="" />
                          <span>일정 공유</span>
                          <S.Chevron src={chevronIcon} alt="" />
                        </S.MenuButton>
                      )}
                    </S.MenuList>
                  </S.SettingsSection>
                  {currentMember && <>
                    <S.Divider />
                    <S.SettingsSection aria-label="기타">
                      <h2>기타</h2>
                      <S.MenuList>
                        <S.MenuButton type="button" $danger onClick={() => openDialog("leave")}>
                          <S.LeaveIcon aria-hidden="true" />
                          <span>여행 나가기</span>
                        </S.MenuButton>
                        {owner && <S.MenuButton type="button" $danger onClick={() => openDialog("delete")}>
                          <img src={deleteIcon} alt="" />
                          <span>코스 삭제</span>
                        </S.MenuButton>}
                      </S.MenuList>
                    </S.SettingsSection>
                  </>}
                </>
              )}
            </S.SettingsContent>
            <S.HomeIndicator />
          </>
        )}
        {showInvite && <ServerInviteSheet tripId={tripId} onClose={() => setShowInvite(false)} />}
        {showShare && <ServerInviteSheet tripId={tripId} onClose={() => setShowShare(false)} publicShare />}
        {dialog && <CourseSettingsConfirmDialog
          dialog={dialog}
          tripName={summary?.title}
          leaveMessage={leaveMessage}
          pending={pending}
          error={actionError}
          onCancel={() => setDialog(undefined)}
          onConfirm={() => void confirmAction()}
        />}
      </S.Page>
    </S.PageShell>
  );
}

function DemoCourseSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const tripId = new URLSearchParams(location.search).get("course") ?? "osaka";
  const trip = readMockTrip(tripId);
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
    copyError,
    inviteLink,
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
    { initialTripName: trip?.title, onSaveTripName: (title) => {
      const current = readMockTrip(tripId);
      return current ? saveMockTrip({ ...current, title }) : false;
    }, ...(showUnsavedMock
      ? {
          initialSheet: "trip",
          initialDraftName: "오사카 우정 여행",
        }
      : {}) },
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
            copyError={copyError}
            inviteLink={inviteLink}
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

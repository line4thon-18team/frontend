import { useState } from "react";
import type { MemberResponse } from "../../api/types";
import avatar from "../../assets/course-settings-details/member-avatar.png";
import backIcon from "../../assets/course-settings/back.svg";
import addBadge from "../../assets/course-settings-details/member-add.svg";
import memberIcon from "../../assets/course-settings-details/menu-invite.svg";
import toggleOff from "../../assets/course-settings-details/toggle-off.svg";
import toggleOn from "../../assets/course-settings-details/toggle-on.svg";
import type { CourseSettingsDialog, CourseSettingsView } from "../../types/courseSettings";
import * as S from "./CourseSettings.styled";

interface DetailViewProps {
  view: Exclude<CourseSettingsView, "menu">;
  onBack: () => void;
  onInvite?: () => void;
  members?: MemberResponse[];
}

const notificationItems = [
  ["출발 전 알림", "여행 7일 전, 1일 전에 알려드려요"],
  ["오늘의 일정", "여행 중 아침에 그날 일정을 보내드려요"],
  ["친구의 일정 변경", "멤버가 장소나 순서를 바꾸면 알려드려요"],
  ["수정 요청", "멤버가 일정 수정을 요청하면 알려드려요"],
  ["코스 추천", "이 여행지의 새 코스와 장소를 알려드려요"],
] as const;

export function CourseSettingsDetailView({ view, onBack, onInvite, members }: DetailViewProps) {
  const [toggles, setToggles] = useState([true, true, true, true, false]);

  if (view === "members") {
    return (
      <>
        <S.DetailNavigation>
          <button type="button" aria-label="코스 설정으로 돌아가기" onClick={onBack}><img src={backIcon} alt="" /></button>
          <h1>멤버 관리</h1>
        </S.DetailNavigation>
        <S.MemberBody>
          <p>참여자 {members?.length ?? 1}명</p>
          {members ? members.map((member) => (
            <S.MemberCard key={member.userId}>
              <img src={member.profileImageUrl || avatar} alt="" />
              <div>
                <strong>{member.name} {member.me && <span>(나)</span>}</strong>
                <small>{member.role === "OWNER" ? "여행 생성자" : "참여자"}</small>
              </div>
              <em>편집 가능</em>
            </S.MemberCard>
          )) : <S.MemberCard>
            <img src={avatar} alt="" />
            <div><strong>우예빈 <span>(나)</span></strong><small>여행 생성자</small></div>
            <em>편집 가능</em>
          </S.MemberCard>}
          {(members?.length ?? 1) === 1 && <S.EmptyMembers>
            <S.AddMemberIcon><img src={memberIcon} alt="" /><img src={addBadge} alt="" /></S.AddMemberIcon>
            <strong>아직 함께하는 친구가 없어요</strong>
            <p>친구를 초대하면 일정을 함께 고칠 수 있어요</p>
            {onInvite && <button type="button" onClick={onInvite}>친구 초대하기</button>}
          </S.EmptyMembers>}
        </S.MemberBody>
        <S.HomeIndicator />
      </>
    );
  }

  return (
    <>
      <S.DetailNavigation>
        <button type="button" aria-label="코스 설정으로 돌아가기" onClick={onBack}><img src={backIcon} alt="" /></button>
        <h1>알림 설정</h1>
      </S.DetailNavigation>
      <S.NotificationBody>
        {["여행 알림", "함께하기", "추천"].map((section, sectionIndex) => {
          const start = sectionIndex === 0 ? 0 : sectionIndex === 1 ? 2 : 4;
          const end = sectionIndex === 0 ? 2 : sectionIndex === 1 ? 4 : 5;
          return (
            <S.NotificationSection key={section}>
              <h2>{section}</h2>
              {notificationItems.slice(start, end).map(([title, description], relativeIndex) => {
                const index = start + relativeIndex;
                return (
                  <S.NotificationRow key={title}>
                    <div><strong>{title}</strong><span>{description}</span></div>
                    <button type="button" role="switch" aria-checked={toggles[index]} aria-label={`${title} ${toggles[index] ? "끄기" : "켜기"}`} onClick={() => setToggles((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}>
                      <img src={toggles[index] ? toggleOn : toggleOff} alt="" />
                    </button>
                  </S.NotificationRow>
                );
              })}
            </S.NotificationSection>
          );
        })}
      </S.NotificationBody>
      <S.HomeIndicator />
    </>
  );
}

interface DialogProps {
  dialog: Exclude<CourseSettingsDialog, null> | "leave";
  onCancel: () => void;
  onConfirm: () => void;
  tripName?: string;
  leaveMessage?: string;
  pending?: boolean;
  error?: string;
}

export function CourseSettingsConfirmDialog({ dialog, onCancel, onConfirm, tripName = "교토 2박 3일", leaveMessage, pending = false, error }: DialogProps) {
  const isDelete = dialog === "delete";
  const isLeave = dialog === "leave";
  return (
    <S.ConfirmLayer role="presentation" onMouseDown={(event) => !pending && event.target === event.currentTarget && onCancel()}>
      <S.ConfirmDialog role="alertdialog" aria-modal="true" aria-labelledby="course-confirm-title">
        <h2 id="course-confirm-title">{isLeave ? "여행에서 나갈까요?" : isDelete ? "코스를 삭제할까요?" : "이 코스를 복제할까요?"}</h2>
        <p>{isLeave ? leaveMessage : isDelete ? <>‘{tripName}’의 일정과 장소가<br />모두 지워지고 되돌릴 수 없어요</> : <>‘{tripName}’ 코스가<br />내 여행에 하나 더 추가돼요</>}</p>
        {error && <p role="alert">{error}</p>}
        <div>
          <button type="button" disabled={pending} onClick={onCancel}>취소</button>
          <button type="button" disabled={pending} data-danger={isDelete || isLeave || undefined} onClick={onConfirm}>{pending ? "처리 중…" : isLeave ? "나가기" : isDelete ? "삭제" : "복제하기"}</button>
        </div>
      </S.ConfirmDialog>
    </S.ConfirmLayer>
  );
}

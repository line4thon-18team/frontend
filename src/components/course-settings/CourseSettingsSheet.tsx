import { useState, type RefObject } from "react";
import closeIcon from "../../assets/course-settings/close.svg";
import editIcon from "../../assets/course-settings/edit.svg";
import linkIcon from "../../assets/course-settings/link.svg";
import successCheck from "../../assets/course-settings/success-check.svg";
import successRing from "../../assets/course-settings/success-ring.svg";
import coverOne from "../../assets/course-settings-details/cover-1.png";
import coverTwo from "../../assets/course-settings-details/cover-2.png";
import coverThree from "../../assets/course-settings-details/cover-3.png";
import coverFour from "../../assets/course-settings-details/cover-4.png";
import durationMinus from "../../assets/course-settings-details/duration-minus.svg";
import durationPlus from "../../assets/course-settings-details/duration-plus.svg";
import selectedCheck from "../../assets/course-settings-details/selected-check.svg";
import {
  courseInviteLink,
  courseMembers,
  courseShareTargets,
} from "../../data/mocks/courseSettingsData";
import type { CourseSettingsSheet as SheetName } from "../../types/courseSettings";
import * as S from "./CourseSettings.styled";

interface CourseSettingsSheetProps {
  activeSheet: SheetName;
  tripName: string;
  draftName: string;
  isDirty: boolean;
  isEditingName: boolean;
  copied: boolean;
  nameInputRef: RefObject<HTMLInputElement | null>;
  onDraftNameChange: (value: string) => void;
  onStartEditingName: () => void;
  onSaveTripName: () => void;
  onSaveAndClose: () => void;
  onDiscardAndClose: () => void;
  onCancelNameEdit: () => void;
  onCopyInviteLink: () => void;
  onNotice: (message: string) => void;
  onClose: () => void;
  initialCloseConfirm?: boolean;
  selectedCover: number;
  tripDays: number;
  onCoverChange: (index: number) => void;
  onSaveCover: () => void;
  onTripDaysChange: (days: number) => void;
  onSaveDuration: () => void;
}

const sheetTitles: Record<SheetName, string> = {
  trip: "여행 정보 수정",
  invite: "친구 초대",
  cover: "대표 이미지 변경",
  duration: "여행 기간 변경",
};

const coverImages = [coverOne, coverTwo, coverThree, coverFour];

function CourseSettingsSheet({
  activeSheet,
  tripName,
  draftName,
  isDirty,
  isEditingName,
  copied,
  nameInputRef,
  onDraftNameChange,
  onStartEditingName,
  onSaveTripName,
  onSaveAndClose,
  onDiscardAndClose,
  onCancelNameEdit,
  onCopyInviteLink,
  onNotice,
  onClose,
  initialCloseConfirm = false,
  selectedCover,
  tripDays,
  onCoverChange,
  onSaveCover,
  onTripDaysChange,
  onSaveDuration,
}: CourseSettingsSheetProps) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(
    initialCloseConfirm,
  );

  const requestClose = () => {
    if (activeSheet === "trip" && isDirty) {
      setShowCloseConfirm(true);
      return;
    }
    onClose();
  };

  return (
    <S.SheetLayer
      role="presentation"
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        requestClose();
      }}
    >
      <S.BottomSheet
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${activeSheet}-sheet-title`}
      >
        <S.Grabber />
        <S.SheetHeader>
          <h2 id={`${activeSheet}-sheet-title`}>
            {sheetTitles[activeSheet]}
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onMouseDown={(event) => event.preventDefault()}
            onClick={requestClose}
          >
            <img src={closeIcon} alt="" />
          </button>
        </S.SheetHeader>

        {activeSheet === "trip" && (
          <S.TripDetails>
            <S.DetailRow>
              <dt>여행 이름</dt>
              <dd>
                {isEditingName ? (
                  <S.NameEditor
                    ref={nameInputRef}
                    value={draftName}
                    aria-label="여행 이름"
                    onChange={(event) => onDraftNameChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") onSaveTripName();
                      if (event.key === "Escape") onCancelNameEdit();
                    }}
                  />
                ) : (
                  <span>{tripName}</span>
                )}
                <button
                  type="button"
                  aria-label="여행 이름 수정"
                  onClick={onStartEditingName}
                >
                  <img src={editIcon} alt="" />
                </button>
              </dd>
            </S.DetailRow>
            <S.DetailRow>
              <dt>여행지</dt>
              <dd>일본 · 도쿄</dd>
            </S.DetailRow>
            <S.DetailRow>
              <dt>날짜</dt>
              <dd>2026.05.18 – 05.21 · 3박 4일</dd>
            </S.DetailRow>
            <S.DetailRow>
              <dt>인원</dt>
              <dd>3명</dd>
            </S.DetailRow>
            <S.DetailRow>
              <dt>이동 수단</dt>
              <dd>대중교통</dd>
            </S.DetailRow>
          </S.TripDetails>
        )}
        {activeSheet === "invite" && (
          <S.InviteContent>
            <S.LinkBox>
              <img src={linkIcon} alt="" />
              <span>{courseInviteLink.replace("https://", "")}</span>
              <button type="button" onClick={onCopyInviteLink}>
                링크 복사
              </button>
            </S.LinkBox>
            <S.CopyMessage
              $visible={copied}
              aria-hidden={!copied}
              aria-live="polite"
            >
              <S.SuccessIcon aria-hidden="true">
                <img src={successRing} alt="" />
                <img src={successCheck} alt="" />
              </S.SuccessIcon>
              링크를 복사했어요
            </S.CopyMessage>

            <S.MemberSection>
              <h3>함께하는 친구</h3>
              <S.MemberList>
                {courseMembers.map((member) => (
                  <li key={member.name}>
                    <img src={member.avatar} alt="" />
                    <strong>
                      {member.name} <small>{member.suffix}</small>
                    </strong>
                    <span>{member.role}</span>
                  </li>
                ))}
              </S.MemberList>
            </S.MemberSection>

            <S.ShareSection>
              <h3>다른 앱으로 공유</h3>
              <S.ShareList>
                {courseShareTargets.map((target) => (
                  <li key={target.label}>
                    <button
                      type="button"
                      onClick={() =>
                        onNotice(
                          `${target.label} 공유 목업을 확인했어요.`,
                        )
                      }
                    >
                      <img src={target.image} alt="" />
                      <span>{target.label}</span>
                    </button>
                  </li>
                ))}
              </S.ShareList>
            </S.ShareSection>
          </S.InviteContent>
        )}
        {activeSheet === "cover" && (
          <S.CoverContent>
            <p>코스에 담긴 장소 사진 중에서 골라주세요</p>
            <S.CoverGrid>
              {coverImages.map((image, index) => (
                <button key={image} type="button" aria-label={`대표 이미지 ${index + 1} 선택`} aria-pressed={selectedCover === index} onClick={() => onCoverChange(index)}>
                  <img src={image} alt="" />
                  {selectedCover === index && <span><img src={selectedCheck} alt="" /></span>}
                </button>
              ))}
              <label>
                <strong aria-hidden="true">＋</strong>
                <span>앨범에서 선택</span>
                <input type="file" accept="image/*" aria-label="앨범에서 대표 이미지 선택" onChange={() => onNotice("앨범에서 고른 사진을 대표 이미지 후보에 추가했어요.")} />
              </label>
            </S.CoverGrid>
            <S.SheetPrimaryButton type="button" onClick={onSaveCover}>변경하기</S.SheetPrimaryButton>
          </S.CoverContent>
        )}
        {activeSheet === "duration" && (
          <S.DurationContent>
            <p>지금 코스는 {tripDays}일 일정이에요</p>
            <S.DurationControl>
              <button type="button" aria-label="여행 기간 하루 줄이기" disabled={tripDays <= 1} onClick={() => onTripDaysChange(Math.max(1, tripDays - 1))}><img src={durationMinus} alt="" /></button>
              <div><strong>{tripDays - 1}박 {tripDays}일</strong><span>1일차 ~ {tripDays}일차</span></div>
              <button type="button" aria-label="여행 기간 하루 늘리기" disabled={tripDays >= 10} onClick={() => onTripDaysChange(Math.min(10, tripDays + 1))}><img src={durationPlus} alt="" /></button>
            </S.DurationControl>
            <S.SheetPrimaryButton type="button" onClick={onSaveDuration}>변경하기</S.SheetPrimaryButton>
          </S.DurationContent>
        )}
      </S.BottomSheet>

      {showCloseConfirm && (
        <S.CloseConfirmLayer
          role="presentation"
          onMouseDown={(event) => {
            event.stopPropagation();
            if (event.target === event.currentTarget) {
              setShowCloseConfirm(false);
            }
          }}
        >
          <S.CloseConfirmDialog
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="unsaved-trip-title"
          >
            <h2 id="unsaved-trip-title">저장하지 않고 닫을까요?</h2>
            <p>바꾼 여행 정보가 저장되지 않아요</p>
            <div>
              <button type="button" onClick={onDiscardAndClose}>
                닫기
              </button>
              <button type="button" onClick={onSaveAndClose}>
                저장하기
              </button>
            </div>
          </S.CloseConfirmDialog>
        </S.CloseConfirmLayer>
      )}
    </S.SheetLayer>
  );
}

export default CourseSettingsSheet;

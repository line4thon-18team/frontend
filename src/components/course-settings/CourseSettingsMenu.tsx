import bellIcon from "../../assets/course-settings-details/menu-bell.svg";
import cameraIcon from "../../assets/course-settings-details/menu-camera.svg";
import copyIcon from "../../assets/course-settings-details/menu-copy.svg";
import daysIcon from "../../assets/course-settings-details/menu-days.svg";
import deleteIcon from "../../assets/course-settings-details/menu-delete.svg";
import inviteBadgeIcon from "../../assets/course-settings-details/member-add.svg";
import inviteIcon from "../../assets/course-settings-details/menu-invite.svg";
import memberIcon from "../../assets/course-settings-details/menu-members.svg";
import originIcon from "../../assets/course-settings-details/menu-origin.svg";
import pinIcon from "../../assets/course-settings-details/menu-pin.svg";
import chevronIcon from "../../assets/figma/settings-chevron.svg";
import type { CourseSettingsSheet } from "../../types/courseSettings";
import * as S from "./CourseSettings.styled";

interface CourseSettingsMenuProps {
  onOpenSheet: (sheet: CourseSettingsSheet) => void;
  onOpenMembers: () => void;
  onOpenNotifications: () => void;
  onOpenClone: () => void;
  onOpenDelete: () => void;
  onOpenOrigin: () => void;
}

function CourseSettingsMenu({
  onOpenSheet,
  onOpenMembers,
  onOpenNotifications,
  onOpenClone,
  onOpenDelete,
  onOpenOrigin,
}: CourseSettingsMenuProps) {
  return (
    <S.SettingsContent>
      <S.SettingsSection aria-labelledby="trip-info-heading">
        <h2 id="trip-info-heading">여행 정보</h2>
        <S.MenuList>
          <S.MenuButton type="button" onClick={() => onOpenSheet("trip")}>
            <img src={pinIcon} alt="" />
            <span>여행 정보 수정</span>
            <S.MenuMeta>날짜, 동행 미등록</S.MenuMeta>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton type="button" onClick={() => onOpenSheet("cover")}>
            <img src={cameraIcon} alt="" />
            <span>대표 이미지 변경</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
        </S.MenuList>
      </S.SettingsSection>

      <S.Divider />

      <S.SettingsSection aria-labelledby="together-heading">
        <h2 id="together-heading">함께하기</h2>
        <S.MenuList>
          <S.MenuButton type="button" onClick={() => onOpenSheet("invite")}>
            <S.IconStack>
              <img src={inviteIcon} alt="" />
              <img src={inviteBadgeIcon} alt="" />
            </S.IconStack>
            <span>친구 초대</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton type="button" onClick={onOpenMembers}>
            <img src={memberIcon} alt="" />
            <span>멤버 관리</span>
            <S.MenuMeta>1명</S.MenuMeta>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
        </S.MenuList>
      </S.SettingsSection>

      <S.Divider />

      <S.SettingsSection aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">일정 관리</h2>
        <S.MenuList>
          <S.MenuButton type="button" onClick={() => onOpenSheet("duration")}>
            <img src={daysIcon} alt="" />
            <span>여행 기간 변경</span>
            <S.MenuMeta>2박 3일</S.MenuMeta>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton type="button" onClick={onOpenOrigin}>
            <img src={originIcon} alt="" />
            <span>원본 코스 보기</span>
            <S.MenuMeta>산책하는 유진</S.MenuMeta>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton type="button" onClick={onOpenClone}>
            <img src={copyIcon} alt="" />
            <span>코스 복제</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
        </S.MenuList>
      </S.SettingsSection>

      <S.Divider />

      <S.SettingsSection aria-labelledby="other-heading">
        <h2 id="other-heading">기타</h2>
        <S.MenuList>
          <S.MenuButton type="button" onClick={onOpenNotifications}>
            <img src={bellIcon} alt="" />
            <span>알림 설정</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton type="button" $danger onClick={onOpenDelete}>
            <img src={deleteIcon} alt="" />
            <span>코스 삭제</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
        </S.MenuList>
      </S.SettingsSection>
    </S.SettingsContent>
  );
}

export default CourseSettingsMenu;

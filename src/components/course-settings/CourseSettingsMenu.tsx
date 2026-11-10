import bellIcon from "../../assets/course-settings/bell.svg";
import cameraIcon from "../../assets/course-settings/camera.svg";
import deleteIcon from "../../assets/course-settings/delete.svg";
import memberIcon from "../../assets/course-settings/member.svg";
import pinIcon from "../../assets/course-settings/pin.svg";
import chevronIcon from "../../assets/figma/settings-chevron.svg";
import type { CourseSettingsSheet } from "../../types/courseSettings";
import * as S from "./CourseSettings.styled";

interface CourseSettingsMenuProps {
  onOpenSheet: (sheet: CourseSettingsSheet) => void;
  onOpenCommunity: () => void;
  onNotice: (message: string) => void;
}

function CourseSettingsMenu({
  onOpenSheet,
  onOpenCommunity,
  onNotice,
}: CourseSettingsMenuProps) {
  return (
    <S.SettingsContent>
      <S.SettingsSection aria-labelledby="course-edit-heading">
        <h2 id="course-edit-heading">코스 편집</h2>
        <S.MenuList>
          <S.MenuButton type="button" onClick={() => onOpenSheet("trip")}>
            <img src={pinIcon} alt="" />
            <span>내 여행 수정</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton
            type="button"
            onClick={() =>
              onNotice("피그마 목업의 오사카 대표 이미지를 적용했어요.")
            }
          >
            <img src={cameraIcon} alt="" />
            <span>대표 이미지 수정</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
        </S.MenuList>
      </S.SettingsSection>

      <S.Divider />

      <S.SettingsSection aria-labelledby="feature-heading">
        <h2 id="feature-heading">기능</h2>
        <S.MenuList>
          <S.MenuButton
            type="button"
            onClick={() =>
              onNotice("여행 일정 변경 알림을 켰어요.")
            }
          >
            <img src={bellIcon} alt="" />
            <span>알림 설정</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton
            type="button"
            onClick={() =>
              onNotice("데모에서는 코스를 안전하게 유지하고 있어요.")
            }
          >
            <img src={deleteIcon} alt="" />
            <span>코스 삭제하기</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
        </S.MenuList>
      </S.SettingsSection>

      <S.Divider />

      <S.SettingsSection aria-labelledby="member-heading">
        <h2 id="member-heading">멤버</h2>
        <S.MenuList>
          <S.MenuButton type="button" onClick={onOpenCommunity}>
            <img src={memberIcon} alt="" />
            <span>함께 계획하기</span>
            <S.Chevron src={chevronIcon} alt="" />
          </S.MenuButton>
          <S.MenuButton type="button" onClick={() => onOpenSheet("invite")}>
            <img src={memberIcon} alt="" />
            <span>친구 초대</span>
            <S.ActionBadge $tone="cyan" aria-hidden="true" />
          </S.MenuButton>
          <S.MenuButton
            type="button"
            onClick={() =>
              onNotice("데모에서는 멤버 상태를 그대로 유지하고 있어요.")
            }
          >
            <S.LeaveIcon aria-hidden="true">
              <span />
            </S.LeaveIcon>
            <span>코스 나가기</span>
            <S.ActionBadge $tone="pink" aria-hidden="true" />
          </S.MenuButton>
        </S.MenuList>
      </S.SettingsSection>
    </S.SettingsContent>
  );
}

export default CourseSettingsMenu;

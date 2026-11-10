import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import bellIcon from "../assets/course-settings/bell.svg";
import locationIcon from "../assets/course-settings/pin.svg";
import courseIcon from "../assets/icons/my-route.svg";
import profileIcon from "../assets/icons/nav-profile.svg";
import airplaneIcon from "../assets/icons/transport-airplane.svg";
import chevronIcon from "../assets/icons/nav-chevron-right-muted.svg";
import noticeIcon from "../assets/figma/my-flag.svg";
import faqIcon from "../assets/figma/my-search.svg";
import feedbackIcon from "../assets/figma/my-pen.svg";
import blueAvatar from "../assets/images/character-blue.webp";
import purpleAvatar from "../assets/images/character-purple.webp";
import googleMapsLogo from "../assets/images/brand-google-maps.webp";
import { routes } from "../config/routes";
import { myProfile } from "../data/mocks/myData";
import {
  countEnabledNotifications,
  readNotificationSettings,
  readProfileSettings,
} from "../utils/mySettings";
import * as S from "./MyPage.styled";

function MyPage() {
  const location = useLocation();
  const [profile] = useState(() => readProfileSettings(window.localStorage));
  const [notificationCount] = useState(() =>
    countEnabledNotifications(readNotificationSettings(window.localStorage)),
  );
  const [showSavedToast, setShowSavedToast] = useState(
    () => Boolean((location.state as { profileSaved?: boolean } | null)?.profileSaved),
  );

  useEffect(() => {
    if (!showSavedToast) return;
    const timeoutId = window.setTimeout(() => setShowSavedToast(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [showSavedToast]);

  const avatar = profile.avatar === "purple" ? purpleAvatar : blueAvatar;

  return (
    <S.Page>
      <S.ProfileSection>
        <S.Avatar>
          <img src={avatar} alt="" />
        </S.Avatar>
        <S.ProfileText>
          <strong>{profile.nickname}</strong>
          <small>{profile.introduction}</small>
        </S.ProfileText>
        <S.EditButton to={routes.profileEdit}>프로필 수정</S.EditButton>
      </S.ProfileSection>

      <S.Stats aria-label="저장 및 여행 요약">
        <S.StatLink to={`${routes.savedItems}?tab=places`}>
          <img src={locationIcon} alt="" />
          <strong>{myProfile.savedPlaceCount}</strong>
          <span>저장한 장소</span>
        </S.StatLink>
        <S.StatLink to={`${routes.savedItems}?tab=courses`}>
          <img src={courseIcon} alt="" />
          <strong>{myProfile.savedCourseCount}</strong>
          <span>저장한 코스</span>
        </S.StatLink>
        <S.StatLink to={`${routes.myTrips}?tab=past`}>
          <img src={airplaneIcon} alt="" />
          <strong>{myProfile.visitedTripCount}</strong>
          <span>다녀온 여행</span>
        </S.StatLink>
      </S.Stats>

      <S.GoogleLink to={`${routes.savedItems}?tab=places`}>
        <S.GoogleLogo>
          <img src={googleMapsLogo} alt="Google Maps" />
        </S.GoogleLogo>
        <span>
          <strong>Google Maps 연동 중</strong>
          <small>저장 장소 {myProfile.googlePlaceCount}곳을 불러왔어요</small>
        </span>
        <b>
          <i /> 연동됨
        </b>
      </S.GoogleLink>

      <S.Band />
      <S.MenuSection>
        <h2>설정</h2>
        <S.MenuLink to={routes.notificationSettings}>
          <img src={bellIcon} alt="" />
          <span>알림 설정</span>
          <small>{notificationCount}개 켜짐</small>
          <S.MenuChevron src={chevronIcon} alt="" />
        </S.MenuLink>
        <S.MenuLink to={routes.accountSettings}>
          <img src={profileIcon} alt="" />
          <span>계정 관리</span>
          <small>카카오</small>
          <S.MenuChevron src={chevronIcon} alt="" />
        </S.MenuLink>
      </S.MenuSection>

      <S.Band />
      <S.MenuSection>
        <h2>고객 지원</h2>
        <S.MenuButton type="button">
          <img src={noticeIcon} alt="" />
          <span>공지사항</span>
          <S.MenuChevron src={chevronIcon} alt="" />
        </S.MenuButton>
        <S.MenuButton type="button">
          <img src={faqIcon} alt="" />
          <span>자주 묻는 질문</span>
          <S.MenuChevron src={chevronIcon} alt="" />
        </S.MenuButton>
        <S.MenuButton type="button">
          <img src={feedbackIcon} alt="" />
          <span>도틀로에 의견 보내기</span>
          <S.MenuChevron src={chevronIcon} alt="" />
        </S.MenuButton>
      </S.MenuSection>

      {showSavedToast && <S.Toast role="status">✓ 프로필을 저장했어요</S.Toast>}
    </S.Page>
  );
}

export default MyPage;

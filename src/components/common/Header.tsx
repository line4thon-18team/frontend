import { Link } from "react-router";
import flowBack from "../../assets/icons/nav-back-trip.svg";
import logo from "../../assets/images/brand-dotlo-logo.png";
import back from "../../assets/icons/nav-back.svg";
import bookmark from "../../assets/icons/nav-bookmark.svg";
import bell from "../../assets/icons/nav-notification.svg";
import search from "../../assets/icons/search-default.svg";
import { routes } from "../../config/routes";
import * as S from "./Header.styled";
interface HeaderProps {
  variant?: "home" | "courses" | "trip" | "myTrips" | "my";
  step?: number;
  onBack?: () => void;
  hideProgress?: boolean;
  backDisabled?: boolean;
}
function Header({
  variant = "home",
  step = 1,
  onBack,
  hideProgress = false,
  backDisabled = false,
}: HeaderProps) {
  return (
    <>
      {variant === "trip" ? (
        <>
          <S.TripHeader>
            <button
              type="button"
              aria-label={backDisabled ? "일정 생성 중에는 이전 단계로 이동할 수 없어요" : "이전 단계"}
              onClick={onBack}
              disabled={backDisabled}
            >
              <img src={flowBack} alt="" />
            </button>
            {!hideProgress && <span>{step} / 3</span>}
          </S.TripHeader>
          {!hideProgress && (
            <S.Progress aria-label={`${step}/3 단계`}>
              {[1, 2, 3].map((value) => (
                <span key={value} data-filled={value <= step} />
              ))}
            </S.Progress>
          )}
        </>
      ) : variant === "courses" ? (
        <S.CourseHeader>
          <Link to={routes.home} aria-label="홈으로 돌아가기">
            <img src={back} alt="" />
          </Link>
          <h1>코스 둘러보기</h1>
          <button type="button" aria-label="보관함">
            <img src={bookmark} alt="" />
          </button>
        </S.CourseHeader>
      ) : variant === "my" ? (
        <S.MyHeader>
          <h1>마이</h1>
        </S.MyHeader>
      ) : variant === "myTrips" ? (
        <S.MyTripsHeader>
          <h1>마이트립</h1>
          <Link to={`${routes.myTrips}?search=1`} aria-label="여행 검색">
            <img src={search} alt="" />
          </Link>
          <Link to={`${routes.myTrips}?create=1`} aria-label="새 여행 만들기">
            <S.PlusIcon aria-hidden="true" />
          </Link>
        </S.MyTripsHeader>
      ) : (
        <S.Header>
          <S.Logo to={routes.home} aria-label="닷로 홈">
            <img src={logo} alt="Dotlo" />
          </S.Logo>
          <S.NotificationButton to={routes.notifications} aria-label="알림">
            <img src={bell} alt="" />
          </S.NotificationButton>
        </S.Header>
      )}
    </>
  );
}
export default Header;

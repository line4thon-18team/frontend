import { useLocation, useNavigate } from "react-router";
import calendarIcon from "../assets/invite/calendar.svg";
import dashImage from "../assets/invite/dash.svg";
import dotloMark from "../assets/invite/dotlo-mark.png";
import heroImage from "../assets/invite/hero.png";
import inviterAvatar from "../assets/invite/inviter.png";
import memberIcon from "../assets/invite/member.svg";
import pinIcon from "../assets/invite/pin.svg";
import thumbOne from "../assets/invite/thumb-1.png";
import thumbTwo from "../assets/invite/thumb-2.png";
import thumbThree from "../assets/invite/thumb-3.png";
import thumbFour from "../assets/invite/thumb-4.png";
import ticketShape from "../assets/invite/ticket-shape.svg";
import { routes } from "../config/routes";
import * as S from "./InvitePage.styled";

function InvitePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const inviteState = new URLSearchParams(location.search).get("state");
  const expired = inviteState === "expired";
  const alreadyJoined = inviteState === "joined";

  const acceptInvite = () => {
    window.sessionStorage.setItem("dotlo:invite:osaka-demo", "accepted");
    navigate(`${routes.tripPlan}?from=home&invite=accepted`);
  };

  return (
    <S.Page>
      <S.Hero>
        <img src={heroImage} alt="벚꽃이 핀 오사카성" />
        <S.Scrim />
        <S.Fade />
      </S.Hero>

      <S.InviterPill>
        <S.InviterAvatar><img src={inviterAvatar} alt="" /></S.InviterAvatar>
        <span><strong>우예빈</strong>님이 초대장을 보냈어요</span>
      </S.InviterPill>

      <S.Ticket>
        <img className="ticket-shape" src={ticketShape} alt="" />
        <S.TicketTop>
          <img className="dotlo-mark" src={dotloMark} alt="Dotlo" />
          <h1>오사카 3박 4일</h1>
          <p>함께 여행을 계획하고 취향을 모아봐요</p>
          <S.TripInfo>
            <div><span data-tone="sky"><img src={pinIcon} alt="" /></span><small>어디로</small><strong>오사카</strong></div>
            <div><span data-tone="purple"><img src={calendarIcon} alt="" /></span><small>언제</small><strong>5.18 - 5.21</strong></div>
            <div><span data-tone="yellow"><img src={memberIcon} alt="" /></span><small>누구와</small><strong>우예빈</strong></div>
          </S.TripInfo>
        </S.TicketTop>
        <S.Perforation><img src={dashImage} alt="" /></S.Perforation>
        <S.TicketBottom>
          <h2>담긴 장소 <b>12곳</b></h2>
          <S.Thumbs>
            <img src={thumbOne} alt="도톤보리" />
            <img src={thumbTwo} alt="오사카 골목" />
            <img src={thumbThree} alt="야경" />
            <span><img src={thumbFour} alt="더 많은 장소" /><b>+9</b></span>
          </S.Thumbs>
        </S.TicketBottom>
      </S.Ticket>

      <S.Actions>
        {expired ? (
          <>
            <S.DisabledNotice>만료된 초대 링크예요</S.DisabledNotice>
            <button type="button" onClick={() => navigate(routes.home)}>홈으로 가기</button>
          </>
        ) : (
          <>
            <button type="button" onClick={alreadyJoined ? () => navigate(`${routes.tripPlan}?from=home`) : acceptInvite}>
              {alreadyJoined ? "여행으로 이동하기" : "여행 참여하기"}
            </button>
            <S.LaterButton type="button" onClick={() => navigate(routes.home)}>나중에 볼게요</S.LaterButton>
          </>
        )}
        <S.HomeIndicator />
      </S.Actions>
    </S.Page>
  );
}

export default InvitePage;

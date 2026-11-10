import { useState } from "react";
import { Link, useNavigate } from "react-router";
import backIcon from "../assets/icons/nav-back.svg";
import chevronIcon from "../assets/icons/nav-chevron-right-muted.svg";
import blueAvatar from "../assets/images/character-blue.webp";
import purpleAvatar from "../assets/images/character-purple.webp";
import googleMapsLogo from "../assets/images/brand-google-maps.webp";
import { routes } from "../config/routes";
import {
  readGoogleMapsSettings,
  readProfileSettings,
  saveGoogleMapsSettings,
} from "../utils/mySettings";
import * as S from "./AccountSettingsPage.styled";

const policies = ["서비스 이용약관", "개인정보 처리방침", "위치기반 서비스 이용약관"];

function AccountSettingsPage() {
  const navigate = useNavigate();
  const [profile] = useState(() => readProfileSettings(window.localStorage));
  const [mapsSettings, setMapsSettings] = useState(() =>
    readGoogleMapsSettings(window.localStorage),
  );
  const [dialog, setDialog] = useState<"logout" | null>(null);
  const [notice, setNotice] = useState("");
  const avatar = profile.avatar === "purple" ? purpleAvatar : blueAvatar;

  const connectGoogleMaps = () => {
    const next = { ...mapsSettings, linked: true };
    setMapsSettings(next);
    saveGoogleMapsSettings(window.localStorage, next);
  };

  return (
    <S.Page>
      <S.Header>
        <Link to={routes.my} aria-label="마이 화면으로 돌아가기">
          <img src={backIcon} alt="" />
        </Link>
        <h1>계정 관리</h1>
      </S.Header>

      <S.AccountCard>
        <S.Avatar><img src={avatar} alt="" /></S.Avatar>
        <span>
          <strong>{profile.email}</strong>
          <small><i /> 카카오 로그인 <b>2026년 4월 2일 가입</b></small>
        </span>
      </S.AccountCard>

      <S.Band />
      <S.Section>
        <h2>연결된 서비스</h2>
        <S.ServiceRow>
          <S.ServiceLogo><img src={googleMapsLogo} alt="Google Maps" /></S.ServiceLogo>
          <span>
            <strong>Google Maps</strong>
            <small>
              <i data-linked={mapsSettings.linked} />
              {mapsSettings.linked ? "연동됨, 저장 장소 52곳" : "연동이 필요해요"}
            </small>
          </span>
          {mapsSettings.linked ? (
            <Link to={routes.googleMapsSettings}>관리</Link>
          ) : (
            <button type="button" onClick={connectGoogleMaps}>연결</button>
          )}
        </S.ServiceRow>
      </S.Section>

      <S.Band />
      <S.Section>
        <h2>약관과 개인정보</h2>
        {policies.map((policy) => (
          <S.PolicyButton
            type="button"
            key={policy}
            onClick={() => setNotice(`${policy} 화면은 준비 중이에요`)}
          >
            {policy}<img src={chevronIcon} alt="" />
          </S.PolicyButton>
        ))}
        <S.AccountActions>
          <button type="button" onClick={() => setDialog("logout")}>로그아웃</button>
          <i />
          <Link to={routes.withdrawal}>회원 탈퇴</Link>
        </S.AccountActions>
      </S.Section>
      <S.HomeIndicator />

      {notice && (
        <S.Toast role="status" onAnimationEnd={() => setNotice("")}>{notice}</S.Toast>
      )}

      {dialog === "logout" && (
        <S.Overlay>
          <S.Dialog role="alertdialog" aria-modal="true">
            <strong>로그아웃할까요?</strong>
            <p>언제든 같은 카카오 계정으로 다시 로그인할 수 있어요</p>
            <div>
              <button type="button" onClick={() => setDialog(null)}>취소</button>
              <button type="button" data-primary onClick={() => navigate(routes.home)}>로그아웃</button>
            </div>
          </S.Dialog>
        </S.Overlay>
      )}
    </S.Page>
  );
}

export default AccountSettingsPage;

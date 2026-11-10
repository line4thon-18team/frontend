import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import brandLogo from "../assets/images/brand-dotlo-logo.png";
import appleIcon from "../assets/onboarding/apple.svg";
import cameraIcon from "../assets/onboarding/camera.svg";
import checkAllIcon from "../assets/onboarding/check-all.svg";
import checkIcon from "../assets/onboarding/check.svg";
import clearIcon from "../assets/onboarding/clear.svg";
import googleIcon from "../assets/onboarding/google.svg";
import kakaoIcon from "../assets/onboarding/kakao.svg";
import profileAvatar from "../assets/onboarding/profile-avatar.png";
import profileRing from "../assets/onboarding/profile-ring.svg";
import validCheckIcon from "../assets/onboarding/valid-check.svg";
import welcomeCharacter from "../assets/onboarding/welcome-character.png";
import { routes } from "../config/routes";
import { policyPath, type PolicyDocumentId } from "../data/policyDocuments";
import * as S from "./OnboardingPage.styled";

type AgreementKey = "service" | "privacy" | "age" | "location" | "marketing";

const agreements: Array<{ key: AgreementKey; required: boolean; label: string; details?: boolean }> = [
  { key: "service", required: true, label: "서비스 이용약관", details: true },
  { key: "privacy", required: true, label: "개인정보 수집 및 이용", details: true },
  { key: "age", required: true, label: "만 14세 이상이에요" },
  { key: "location", required: false, label: "위치 정보 이용", details: true },
  { key: "marketing", required: false, label: "혜택과 이벤트 알림 받기", details: true },
];

const agreementPolicy: Partial<Record<AgreementKey, PolicyDocumentId>> = {
  service: "service",
  privacy: "privacy",
  location: "location",
  marketing: "marketing",
};

const preferenceOptions = [
  "맛집 탐방",
  "카페 투어",
  "자연 풍경",
  "역사와 문화",
  "쇼핑",
  "야경",
  "사진 명소",
  "액티비티",
  "온천과 휴식",
  "골목 산책",
];

function Logo() {
  return (
    <S.Logo aria-label="Dotlo">
      <S.SymbolCrop><img src={brandLogo} alt="" /></S.SymbolCrop>
      <S.WordmarkCrop><img src={brandLogo} alt="" /></S.WordmarkCrop>
    </S.Logo>
  );
}

function HomeIndicator() {
  return <S.HomeIndicator aria-hidden="true" />;
}

function LoginBackdrop({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <S.LoginScreen>
      <S.LoginHero $withTagline={withTagline}>
        <Logo />
        {withTagline && (
          <>
            <h1>가고 싶은 곳만 고르면<br />여행 코스가 완성돼요</h1>
            <p>구글맵에 저장한 장소로 AI가 일정을 짜드려요</p>
          </>
        )}
      </S.LoginHero>
    </S.LoginScreen>
  );
}

function OnboardingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [termsOpen, setTermsOpen] = useState(
    () => new URLSearchParams(location.search).get("terms") === "1",
  );
  const [agreementsState, setAgreementsState] = useState<Record<AgreementKey, boolean>>({
    service: true,
    privacy: true,
    age: true,
    location: true,
    marketing: true,
  });
  const [nickname, setNickname] = useState("하늘");
  const [preferences, setPreferences] = useState<string[]>([
    "맛집 탐방",
    "카페 투어",
    "역사와 문화",
    "사진 명소",
  ]);

  const nicknameFromState = (location.state as { nickname?: string } | null)?.nickname;
  const displayNickname = nicknameFromState || nickname || "하늘";
  const allAgreed = useMemo(
    () => agreements.every(({ key }) => agreementsState[key]),
    [agreementsState],
  );
  const requiredAgreed = agreements
    .filter(({ required }) => required)
    .every(({ key }) => agreementsState[key]);

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreementsState({ service: next, privacy: next, age: next, location: next, marketing: next });
  };

  if (location.pathname === routes.onboardingProfile) {
    const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
    return (
      <S.FlowScreen>
        <S.FlowBody>
          <S.Progress aria-label="온보딩 1단계"><i /><i /></S.Progress>
          <h1>어떻게 불러드릴까요?</h1>
          <S.Avatar>
            <img className="ring" src={profileRing} alt="" />
            <img className="photo" src={profileAvatar} alt="프로필 캐릭터" />
            <button type="button" aria-label="프로필 사진 변경"><img src={cameraIcon} alt="" /></button>
          </S.Avatar>
          <S.FieldLabel htmlFor="onboarding-nickname">닉네임</S.FieldLabel>
          <S.NicknameField $valid={valid}>
            <input
              id="onboarding-nickname"
              maxLength={12}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
            />
            <small>{nickname.length}/12</small>
            {nickname && (
              <button type="button" aria-label="닉네임 지우기" onClick={() => setNickname("")}>
                <img src={clearIcon} alt="" />
              </button>
            )}
          </S.NicknameField>
          {valid && <S.ValidText><img src={validCheckIcon} alt="" />사용할 수 있는 닉네임이에요</S.ValidText>}
        </S.FlowBody>
        <S.BottomButton
          type="button"
          disabled={!valid}
          onClick={() => navigate(routes.onboardingPreferences, { state: { nickname: nickname.trim() } })}
        >
          다음
        </S.BottomButton>
        <HomeIndicator />
      </S.FlowScreen>
    );
  }

  if (location.pathname === routes.onboardingPreferences) {
    const togglePreference = (preference: string) => {
      setPreferences((current) =>
        current.includes(preference)
          ? current.filter((item) => item !== preference)
          : [...current, preference],
      );
    };
    const complete = () => navigate(routes.onboardingComplete, { state: { nickname: displayNickname } });
    return (
      <S.FlowScreen>
        <S.SkipButton type="button" onClick={complete}>건너뛰기</S.SkipButton>
        <S.FlowBody>
          <S.Progress $complete aria-label="온보딩 2단계"><i /><i /></S.Progress>
          <h1>어떤 여행을 좋아하세요?</h1>
          <S.Description>골라주시면 취향에 맞는 코스를 먼저 보여드려요</S.Description>
          <S.Chips>
            {preferenceOptions.map((preference) => (
              <button
                type="button"
                key={preference}
                aria-pressed={preferences.includes(preference)}
                onClick={() => togglePreference(preference)}
              >
                {preference}
              </button>
            ))}
          </S.Chips>
          <S.SelectionCount>{preferences.length}개 선택했어요</S.SelectionCount>
        </S.FlowBody>
        <S.BottomButton type="button" onClick={complete}>선택 완료</S.BottomButton>
        <HomeIndicator />
      </S.FlowScreen>
    );
  }

  if (location.pathname === routes.onboardingComplete) {
    return (
      <S.CompleteScreen>
        <S.CompleteContent>
          <img src={welcomeCharacter} alt="반갑게 인사하는 도틀로 캐릭터" />
          <h1>{displayNickname}님, 반가워요!</h1>
          <p>이제 가고 싶은 곳을 모아<br />나만의 여행 코스를 만들어 보세요</p>
        </S.CompleteContent>
        <S.BottomButton type="button" onClick={() => navigate(routes.home)}>시작하기</S.BottomButton>
        <HomeIndicator />
      </S.CompleteScreen>
    );
  }

  return (
    <S.LoginShell>
      <LoginBackdrop withTagline={termsOpen} />
      {!termsOpen && (
        <S.LoginButtons>
          <S.ProviderWrap>
            <S.ProviderButton type="button" $provider="kakao" onClick={() => setTermsOpen(true)}>
              <img src={kakaoIcon} alt="" />카카오로 시작하기
            </S.ProviderButton>
            <span>최근 로그인</span>
          </S.ProviderWrap>
          <S.ProviderButton type="button" $provider="apple" onClick={() => setTermsOpen(true)}>
            <img src={appleIcon} alt="" />Apple로 시작하기
          </S.ProviderButton>
          <S.ProviderButton type="button" $provider="google" onClick={() => setTermsOpen(true)}>
            <img src={googleIcon} alt="" />Google로 시작하기
          </S.ProviderButton>
          <S.GuestButton type="button" onClick={() => navigate(routes.home)}>먼저 둘러볼게요</S.GuestButton>
        </S.LoginButtons>
      )}
      {termsOpen && (
        <>
          <S.Dim onClick={() => setTermsOpen(false)} />
          <S.TermsSheet role="dialog" aria-modal="true" aria-labelledby="terms-title">
            <S.Grabber />
            <h2 id="terms-title">약관에 동의해 주세요</h2>
            <p>도틀로를 이용하려면 필수 약관 동의가 필요해요</p>
            <S.AllAgreement type="button" onClick={toggleAll}>
              <S.Check $large $checked={allAgreed}>{allAgreed && <img src={checkAllIcon} alt="" />}</S.Check>
              <span><strong>전체 동의</strong><small>선택 항목을 포함한 모든 약관에 동의해요</small></span>
            </S.AllAgreement>
            <S.TermDivider />
            <S.TermList>
              {agreements.map((agreement) => (
                <li key={agreement.key}>
                  <button
                    type="button"
                    aria-pressed={agreementsState[agreement.key]}
                    onClick={() => setAgreementsState((current) => ({ ...current, [agreement.key]: !current[agreement.key] }))}
                  >
                    <S.Check $checked={agreementsState[agreement.key]}>
                      {agreementsState[agreement.key] && <img src={checkIcon} alt="" />}
                    </S.Check>
                    <span data-optional={!agreement.required}>[{agreement.required ? "필수" : "선택"}]</span>
                    <b>{agreement.label}</b>
                  </button>
                  {agreement.details && agreementPolicy[agreement.key] && (
                    <button type="button" onClick={() => navigate(policyPath(agreementPolicy[agreement.key]!, true))}>보기</button>
                  )}
                </li>
              ))}
            </S.TermList>
            <S.TermsSubmit
              type="button"
              disabled={!requiredAgreed}
              onClick={() => navigate(routes.onboardingProfile)}
            >
              동의하고 시작하기
            </S.TermsSubmit>
          </S.TermsSheet>
        </>
      )}
      <HomeIndicator />
    </S.LoginShell>
  );
}

export default OnboardingPage;

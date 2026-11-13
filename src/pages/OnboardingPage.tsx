import { useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { onboardingPreferencesToInput } from "../api/adapters";
import {
  canStartGoogleLogin,
  checkNickname,
  completeSignup,
  googleAuthorizationUrl,
} from "../api/auth";
import { apiMode, isApiEnabled } from "../api/config";
import { saveUserPreferences } from "../api/preferences";
import { hasAuthSession } from "../api/tokenStorage";
import brandLogo from "../assets/images/brand-dotlo-logo.png";
import checkAllIcon from "../assets/onboarding/check-all.svg";
import checkIcon from "../assets/onboarding/check.svg";
import clearIcon from "../assets/onboarding/clear.svg";
import googleIcon from "../assets/onboarding/google.svg";
import profileAvatar from "../assets/onboarding/profile-avatar.png";
import profileRing from "../assets/onboarding/profile-ring.svg";
import validCheckIcon from "../assets/onboarding/valid-check.svg";
import welcomeCharacter from "../assets/onboarding/welcome-character.png";
import { routes } from "../config/routes";
import { policyPath, type PolicyDocumentId } from "../data/policyDocuments";
import { parseProfileSettings, PROFILE_STORAGE_KEY, saveProfileSettings, validateNickname, validateNicknameFormat } from "../utils/mySettings";
import { allowDemoAuthentication } from "../utils/authNavigation";
import * as S from "./OnboardingPage.styled";

type AgreementKey = "service" | "privacy" | "age" | "location" | "marketing";
type AgreementState = Record<AgreementKey, boolean>;

interface OnboardingState {
  agreements?: Record<AgreementKey, boolean>;
  nickname?: string;
  preferences?: string[];
  email?: string;
  introduction?: string;
}

const ONBOARDING_NICKNAME_STORAGE_KEY = "dotlo:onboarding:nickname";
const ONBOARDING_AGREEMENTS_STORAGE_KEY = "dotlo:onboarding:agreements";

const initialAgreements: AgreementState = {
  service: false, privacy: false, age: false, location: false, marketing: false,
};

function readStoredAgreements(): AgreementState | null {
  try {
    const stored = sessionStorage.getItem(ONBOARDING_AGREEMENTS_STORAGE_KEY);
    if (!stored) return null;
    const value = JSON.parse(stored) as Partial<AgreementState>;
    const keys: AgreementKey[] = ["service", "privacy", "age", "location", "marketing"];
    return keys.every((key) => typeof value[key] === "boolean")
      ? (value as AgreementState)
      : null;
  } catch {
    return null;
  }
}

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
            <p>샘플 장소를 골라 여행 일정을 만들어 보세요</p>
          </>
        )}
      </S.LoginHero>
    </S.LoginScreen>
  );
}

function OnboardingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const onboarding = location.state as OnboardingState | null;
  const termsOpen =
    location.pathname === routes.onboardingTerms ||
    new URLSearchParams(location.search).get("terms") === "1";
  const [agreementsState, setAgreementsState] = useState(
    () => onboarding?.agreements ?? readStoredAgreements() ?? initialAgreements,
  );
  const [nickname, setNickname] = useState(
    () =>
      onboarding?.nickname ??
      sessionStorage.getItem(ONBOARDING_NICKNAME_STORAGE_KEY) ??
      "하늘",
  );
  const [preferences, setPreferences] = useState<string[]>([]);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [error, setError] = useState("");
  const liveGoogleLogin = isApiEnabled() && canStartGoogleLogin();
  const demoAuthentication = allowDemoAuthentication(import.meta.env.DEV, apiMode);
  const liveSession = isApiEnabled() && hasAuthSession();

  const displayNickname =
    onboarding?.nickname ??
    sessionStorage.getItem(ONBOARDING_NICKNAME_STORAGE_KEY) ??
    "하늘";
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

  const startGoogleLogin = () => {
    if (!liveGoogleLogin && demoAuthentication) {
      navigate(routes.onboardingTerms);
      return;
    }
    if (!liveGoogleLogin) {
      setError("Google 로그인 설정을 확인하고 있어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    try {
      window.location.assign(googleAuthorizationUrl());
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Google 로그인을 시작하지 못했어요.",
      );
    }
  };

  const continueAfterTerms = () => {
    sessionStorage.setItem(
      ONBOARDING_AGREEMENTS_STORAGE_KEY,
      JSON.stringify(agreementsState),
    );
    navigate(routes.onboardingProfile, {
      state: { agreements: agreementsState },
    });
  };

  if (
    location.pathname === routes.onboardingProfile &&
    liveSession &&
    !requiredAgreed
  ) {
    return <Navigate to={routes.onboardingTerms} replace />;
  }

  if (location.pathname === routes.onboardingProfile) {
    const validation = liveSession
      ? validateNicknameFormat(nickname)
      : validateNickname(nickname);
    const changeNickname = (value: string) => {
      setNickname(value);
      setProfileError("");
    };
    const continueProfile = async () => {
      if (!validation.valid || savingProfile) return;
      const value = nickname.trim();
      setProfileError("");
      let email = onboarding?.email;
      let introduction = onboarding?.introduction;

      if (liveSession) {
        setSavingProfile(true);
        try {
          const nicknameCheck = await checkNickname(value);
          if (nicknameCheck?.available === false) {
            setProfileError("이미 사용 중인 닉네임이에요.");
            return;
          }
          if (nicknameCheck?.available !== true) {
            setProfileError("닉네임을 확인하지 못했어요. 다시 시도해 주세요.");
            return;
          }
          await completeSignup({
            agreements: {
              terms: agreementsState.service,
              privacy: agreementsState.privacy,
              age14: agreementsState.age,
              location: agreementsState.location,
            },
            nickname: value,
            characterId: 1,
          });
        } catch (reason) {
          setProfileError(
            reason instanceof Error
              ? reason.message
              : "가입 정보를 저장하지 못했어요. 다시 시도해 주세요.",
          );
          return;
        } finally {
          setSavingProfile(false);
        }
      }

      sessionStorage.setItem(ONBOARDING_NICKNAME_STORAGE_KEY, value);
      navigate(routes.onboardingPreferences, {
        state: {
          agreements: agreementsState,
          nickname: value,
          email,
          introduction,
        },
      });
    };
    return (
      <S.FlowScreen>
        <S.FlowBody>
          <S.Progress aria-label="온보딩 1단계"><i /><i /></S.Progress>
          <h1>어떻게 불러드릴까요?</h1>
          <S.Avatar>
            <img className="ring" src={profileRing} alt="" />
            <img className="photo" src={profileAvatar} alt="프로필 캐릭터" />
          </S.Avatar>
          <S.FieldLabel htmlFor="onboarding-nickname">닉네임</S.FieldLabel>
          <S.NicknameField $valid={validation.valid}>
            <input
              id="onboarding-nickname"
              maxLength={12}
              value={nickname}
              aria-invalid={!validation.valid}
              readOnly={savingProfile}
              onChange={(event) => changeNickname(event.target.value)}
            />
            <small>{nickname.length}/12</small>
            {nickname && (
              <button
                type="button"
                aria-label="닉네임 지우기"
                disabled={savingProfile}
                onClick={() => changeNickname("")}
              >
                <img src={clearIcon} alt="" />
              </button>
            )}
          </S.NicknameField>
          <S.ValidText $error={!validation.valid || Boolean(profileError)} role="status">
            {validation.valid && !savingProfile && !profileError && <img src={validCheckIcon} alt="" />}
            {profileError ||
              (savingProfile
                ? "가입 정보를 저장하고 있어요"
                : validation.valid
                  ? liveSession
                    ? "사용할 수 있는 형식의 닉네임이에요"
                    : "데모에서 사용할 수 있는 닉네임이에요"
                  : validation.message)}
          </S.ValidText>
        </S.FlowBody>
        <S.BottomButton
          type="button"
          disabled={!validation.valid || savingProfile}
          onClick={() => void continueProfile()}
        >
          {savingProfile ? "저장하고 있어요" : "다음"}
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
    const complete = async (chosenPreferences: string[]) => {
      if (savingPreferences) return;
      let email = onboarding?.email;
      let introduction = onboarding?.introduction;

      if (liveSession) {
        setSavingPreferences(true);
        setError("");
        try {
          if (chosenPreferences.length) {
            await saveUserPreferences(
              onboardingPreferencesToInput(chosenPreferences),
            );
          }
        } catch (reason) {
          setError(
            reason instanceof Error
              ? reason.message
              : "여행 취향을 저장하지 못했어요. 다시 시도해 주세요.",
          );
          setSavingPreferences(false);
          return;
        }
        setSavingPreferences(false);
      }
      navigate(routes.onboardingComplete, {
        state: {
          nickname: displayNickname,
          preferences: chosenPreferences,
          email,
          introduction,
        },
      });
    };
    return (
      <S.FlowScreen>
        <S.SkipButton
          type="button"
          disabled={savingPreferences}
          onClick={() => void complete([])}
        >
          건너뛰기
        </S.SkipButton>
        <S.FlowBody>
          <S.Progress $complete aria-label="온보딩 2단계"><i /><i /></S.Progress>
          <h1>어떤 여행을 좋아하세요?</h1>
          <S.Description>
            {liveSession
              ? "고른 취향은 앞으로 만들 여행의 기본값으로 사용해요."
              : "고른 취향은 이 브라우저의 데모 프로필에 저장해요."}
          </S.Description>
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
          {error && <S.ValidText $error role="alert">{error}</S.ValidText>}
        </S.FlowBody>
        <S.BottomButton
          type="button"
          disabled={savingPreferences}
          onClick={() => void complete(preferences)}
        >
          {savingPreferences ? "취향을 저장하고 있어요" : "선택 완료"}
        </S.BottomButton>
        <HomeIndicator />
      </S.FlowScreen>
    );
  }

  if (location.pathname === routes.onboardingComplete) {
    const finishOnboarding = () => {
      try {
        const profile = parseProfileSettings(localStorage.getItem(PROFILE_STORAGE_KEY));
        saveProfileSettings(window.localStorage, {
          nickname: displayNickname,
          email: onboarding?.email ?? profile?.email ?? "",
          introduction: onboarding?.introduction ?? profile?.introduction ?? "",
          avatar: profile?.avatar ?? "blue",
          travelPreferences: onboarding?.preferences ?? [],
        });
        sessionStorage.removeItem(ONBOARDING_NICKNAME_STORAGE_KEY);
        sessionStorage.removeItem(ONBOARDING_AGREEMENTS_STORAGE_KEY);
      } catch {
        setError("브라우저에 데모 프로필을 저장하지 못했어요. 다시 시도해 주세요.");
        return;
      }
      navigate(routes.home);
    };
    return (
      <S.CompleteScreen>
        <S.CompleteContent>
          <img src={welcomeCharacter} alt="반갑게 인사하는 도틀로 캐릭터" />
          <h1>{displayNickname}님, 반가워요!</h1>
          <p>이제 가고 싶은 곳을 모아<br />나만의 여행 코스를 만들어 보세요</p>
          {error && <S.ValidText $error role="alert">{error}</S.ValidText>}
        </S.CompleteContent>
        <S.BottomButton type="button" onClick={finishOnboarding}>시작하기</S.BottomButton>
        <HomeIndicator />
      </S.CompleteScreen>
    );
  }

  return (
    <S.LoginShell>
      <LoginBackdrop withTagline={termsOpen} />
      {!termsOpen && (
        <S.LoginButtons>
          <S.LoginNotice>
            {liveGoogleLogin
              ? "Google 계정으로 로그인하고 내 여행을 안전하게 불러와요."
              : demoAuthentication
                ? "Google 계정 없이 로그인과 가입 흐름을 체험할 수 있어요."
                : "Google 로그인 설정을 확인하고 있어요."}
          </S.LoginNotice>
          <S.ProviderButton
            type="button"
            disabled={!liveGoogleLogin && !demoAuthentication}
            onClick={startGoogleLogin}
          >
            <img src={googleIcon} alt="" />
            {liveGoogleLogin
              ? "Google로 시작하기"
              : demoAuthentication
                ? "Google 로그인 데모 시작"
                : "Google 로그인 준비 중"}
          </S.ProviderButton>
          {demoAuthentication && (
            <S.GuestButton type="button" onClick={() => navigate(routes.home)}>
              먼저 둘러볼게요
            </S.GuestButton>
          )}
        </S.LoginButtons>
      )}
      {termsOpen && (
        <>
          <S.Dim
            onClick={() => {
              if (!liveSession) navigate(routes.login);
            }}
          />
          <S.TermsSheet role="dialog" aria-modal="true" aria-labelledby="terms-title">
            <S.Grabber />
            <h2 id="terms-title">{liveSession ? "약관에 동의해 주세요" : "약관 동의 체험"}</h2>
            <p>
              {liveSession
                ? "도틀로를 이용하려면 필수 약관 동의가 필요해요."
                : "필수 항목을 선택하면 데모 프로필을 만들 수 있어요."}
            </p>
            <S.AllAgreement type="button" aria-pressed={allAgreed} onClick={toggleAll}>
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
                    <button
                      type="button"
                      onClick={() => navigate(policyPath(agreementPolicy[agreement.key]!, true), {
                        state: { agreements: agreementsState },
                      })}
                    >
                      보기
                    </button>
                  )}
                </li>
              ))}
            </S.TermList>
            <S.TermsSubmit
              type="button"
              disabled={!requiredAgreed}
              onClick={continueAfterTerms}
            >
              동의하고 시작하기
            </S.TermsSubmit>
            {error && <S.ValidText $error role="alert">{error}</S.ValidText>}
          </S.TermsSheet>
        </>
      )}
      <HomeIndicator />
    </S.LoginShell>
  );
}

export default OnboardingPage;

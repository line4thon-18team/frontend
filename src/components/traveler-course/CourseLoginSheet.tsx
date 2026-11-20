import { useState } from "react";
import styled from "styled-components";
import { canStartGoogleLogin, googleAuthorizationUrl } from "../../api/auth";
import character from "../../assets/onboarding/course-sign-in.webp";
import googleIcon from "../../assets/onboarding/google.svg";
import { ProviderButton, ValidText } from "../../pages/OnboardingPage.styled";
import { savePendingCourseLogin } from "../../utils/navigation";
import TripSheet from "../common/TripSheet";
import { SheetBody } from "../common/TripSheet.styled";

const Sheet = styled(TripSheet)`
  --sheet-handle-color: #d1d1d6;

  ${SheetBody} {
    padding: 33px 0 max(42px, env(safe-area-inset-bottom));
  }

  .course-login-character {
    align-self: center;
    width: 104px;
    height: 104px;
    object-fit: contain;
  }

  h2 {
    margin: 8px 0 24px;
    text-align: center;
    font-size: 20px;
    line-height: 27px;
  }
`;

export default function CourseLoginSheet({ courseId, importCourse, askPlace = false, onClose }: {
  courseId: number;
  importCourse: boolean;
  askPlace?: boolean;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const subject = askPlace ? "이 장소에 대해" : "이 코스를";
  const actionText = askPlace ? "AI에게 물어보세요" : importCourse ? "내 일정으로 가져오세요" : "찜 목록에 담아보세요";

  const login = () => {
    if (!canStartGoogleLogin()) {
      setError("Google 로그인 설정을 확인하고 있어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    try {
      const authorizationUrl = googleAuthorizationUrl();
      savePendingCourseLogin(sessionStorage, courseId, importCourse);
      window.location.assign(authorizationUrl);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Google 로그인을 시작하지 못했어요.");
    }
  };

  return (
    <Sheet title={`로그인하고 ${subject} ${actionText}`} hideHeader contentGap={0} onClose={onClose}>
      <img className="course-login-character" src={character} alt="" />
      <h2>로그인하고 {subject}<br />{actionText}</h2>
      <ProviderButton type="button" onClick={login}>
        <img src={googleIcon} alt="" />
        Google로 시작하기
      </ProviderButton>
      {error && <ValidText $error role="alert">{error}</ValidText>}
    </Sheet>
  );
}

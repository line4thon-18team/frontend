import { useEffect, useState } from "react";
import { Navigate, Outlet, ScrollRestoration, useLocation, useMatch } from "react-router";
import { getMe, SIGNUP_COMPLETED_EVENT } from "./api/auth";
import { apiMode } from "./api/config";
import { hasAuthSession } from "./api/tokenStorage";
import { routes } from "./config/routes";
import { GlobalStyle } from "./styles/GlobalStyle";
import { shouldCompleteSignup } from "./utils/authFlow";
import {
  allowDemoAuthentication,
  authRedirectPath,
  isOnboardingRoute,
} from "./utils/authNavigation";

type SignupStatus = "idle" | "checking" | "complete" | "incomplete" | "error";

function App() {
  const location = useLocation();
  const hasSession = hasAuthSession();
  const [signupStatus, setSignupStatus] = useState<SignupStatus>(() =>
    hasSession ? "checking" : "idle",
  );
  const demoAuthentication = allowDemoAuthentication(import.meta.env.DEV, apiMode);
  const loginRedirect = authRedirectPath(location.pathname, demoAuthentication);
  const sharedTripRoute = Boolean(useMatch(routes.sharedTrip));
  const signupFlowRoute =
    isOnboardingRoute(location.pathname) ||
    location.pathname === routes.googleAuthCallback ||
    (location.pathname.startsWith("/my/account/policies/") &&
      new URLSearchParams(location.search).get("from") === "login");

  useEffect(() => {
    if (!hasSession) return;
    const controller = new AbortController();
    const markComplete = () => setSignupStatus("complete");

    void getMe(controller.signal)
      .then((user) => {
        if (!controller.signal.aborted) {
          setSignupStatus(
            shouldCompleteSignup(user.signupCompleted) ? "incomplete" : "complete",
          );
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setSignupStatus("error");
      });
    window.addEventListener(SIGNUP_COMPLETED_EVENT, markComplete);
    return () => {
      controller.abort();
      window.removeEventListener(SIGNUP_COMPLETED_EVENT, markComplete);
    };
  }, [hasSession]);

  if (!hasSession && loginRedirect) {
    return <Navigate to={loginRedirect} replace />;
  }

  if (hasSession && !signupFlowRoute && !sharedTripRoute) {
    if (signupStatus === "idle" || signupStatus === "checking") {
      return <main role="status">가입 정보를 확인하고 있어요…</main>;
    }
    if (signupStatus === "error") {
      return (
        <main>
          <p role="alert">가입 정보를 확인하지 못했어요.</p>
          <button type="button" onClick={() => window.location.reload()}>다시 시도</button>
        </main>
      );
    }
    if (signupStatus === "incomplete") {
      return <Navigate to={routes.onboardingTerms} replace />;
    }
  }

  if (hasSession && location.pathname === routes.login && signupStatus === "complete") {
    return <Navigate to={routes.home} replace />;
  }

  return (
    <>
      <GlobalStyle />
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
export default App;

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { loginWithGoogleCode, validateOAuthState } from "../api/auth";
import { routes } from "../config/routes";
import { shouldCompleteSignup } from "../utils/authFlow";
import { takePendingInvitePath } from "../utils/navigation";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [callback] = useState(() => {
    const code = params.get("code");
    if (params.get("error")) {
      return { code: null, error: "Google 로그인이 취소되었어요." };
    }
    if (!code || !validateOAuthState(params.get("state"))) {
      return {
        code: null,
        error: "로그인 정보를 확인하지 못했어요. 다시 시도해 주세요.",
      };
    }
    return { code, error: "" };
  });
  const [error, setError] = useState(callback.error);

  useEffect(() => {
    if (!callback.code) return;

    const controller = new AbortController();
    void loginWithGoogleCode(callback.code)
      .then((response) => {
        if (!controller.signal.aborted) {
          navigate(
            shouldCompleteSignup(response.signupCompleted)
              ? routes.onboardingTerms
              : takePendingInvitePath(sessionStorage) ?? routes.home,
            { replace: true },
          );
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "로그인을 완료하지 못했어요. 다시 시도해 주세요.",
          );
        }
      });
    return () => controller.abort();
  }, [callback, navigate]);

  return (
    <main aria-busy={!error} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
      {error ? (
        <section style={{ textAlign: "center" }}>
          <p role="alert">{error}</p>
          <button type="button" onClick={() => navigate(routes.login, { replace: true })}>
            로그인 화면으로 돌아가기
          </button>
        </section>
      ) : (
        <p role="status">Google 로그인을 마무리하고 있어요…</p>
      )}
    </main>
  );
}

export default AuthCallbackPage;


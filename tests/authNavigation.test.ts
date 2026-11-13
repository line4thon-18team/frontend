import assert from "node:assert/strict";
import test from "node:test";
import {
  allowDemoAuthentication,
  authRedirectPath,
  isPublicRoute,
} from "../src/utils/authNavigation.ts";

test("로그인과 콜백, 초대, 약관 상세는 세션 없이 열 수 있다", () => {
  assert.equal(isPublicRoute("/login"), true);
  assert.equal(isPublicRoute("/auth/callback/google"), true);
  assert.equal(isPublicRoute("/invite/sample-token"), true);
  assert.equal(isPublicRoute("/my/account/policies/privacy"), true);
  assert.equal(isPublicRoute("/terms/privacy"), true);
  assert.equal(authRedirectPath("/terms/privacy"), null);
  assert.equal(authRedirectPath("/my/account/withdrawal/complete"), null);
  assert.equal(authRedirectPath("/my/account/withdrawal"), "/login");
});

test("홈과 온보딩, 앱 내부 화면은 로그인으로 보낸다", () => {
  assert.equal(authRedirectPath("/"), "/login");
  assert.equal(authRedirectPath("/onboarding/profile"), "/login");
  assert.equal(authRedirectPath("/my-trips"), "/login");
});

test("개발용 데모에서는 세션 없이 온보딩 단계를 이동할 수 있다", () => {
  assert.equal(authRedirectPath("/onboarding/terms", true), null);
  assert.equal(authRedirectPath("/onboarding/profile", true), null);
  assert.equal(authRedirectPath("/onboarding/preferences", true), null);
  assert.equal(authRedirectPath("/onboarding/complete", true), null);
});

test("데모 로그인은 개발 환경 또는 명시적인 목업 모드에서만 허용한다", () => {
  assert.equal(allowDemoAuthentication(true, "auto"), true);
  assert.equal(allowDemoAuthentication(false, "mock"), true);
  assert.equal(allowDemoAuthentication(false, "auto"), false);
  assert.equal(allowDemoAuthentication(false, "live"), false);
});

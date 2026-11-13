import assert from "node:assert/strict";
import test from "node:test";
import {
  isDirectTripMode,
  importedTripPath,
  readPlanOrigin,
  settingsBackPath,
  tripCommunityPath,
  tripPlanBackPath,
  tripPlanPath,
  tripSettingsPath,
  travelerCoursePath,
} from "../src/utils/navigation.ts";
import { routes } from "../src/config/routes.ts";
import { policyPath } from "../src/data/policyDocuments.ts";

test("일정 결과 경로에 진입 출처와 코스가 유지된다", () => {
  assert.equal(
    tripPlanPath("courses", "kyoto-walk"),
    "/trips/plan?from=courses&course=kyoto-walk",
  );
  assert.equal(readPlanOrigin("?from=generated"), "generated");
  assert.equal(readPlanOrigin("?from=my-trips"), "my-trips");
  assert.equal(readPlanOrigin("?from=unknown"), "home");
});

test("일정 결과와 설정 화면의 뒤로가기는 앱 안에서 이어진다", () => {
  assert.equal(tripPlanBackPath("?from=courses"), "/courses");
  assert.equal(tripPlanBackPath("?from=my-trips"), "/my-trips");
  assert.equal(tripPlanBackPath("?from=generated"), "/");
  assert.equal(tripSettingsPath("generated"), "/trips/settings?from=generated");
  assert.equal(tripCommunityPath("generated"), "/trips/community?from=generated");
  assert.equal(settingsBackPath("?from=courses"), "/trips/plan?from=courses");
  for (const path of [
    tripSettingsPath("my-trips", "osaka", 42),
    tripCommunityPath("my-trips", "osaka", 42),
  ]) {
    assert.equal(settingsBackPath(path.slice(path.indexOf("?"))), "/trips/plan?from=my-trips&tripId=42");
  }
  assert.equal(routes.tripSettings, "/trips/settings");
});

test("홈의 주요 탭과 알림 경로가 앱 안에 등록된다", () => {
  assert.equal(routes.notifications, "/notifications");
  assert.equal(routes.myTrips, "/my-trips");
  assert.equal(routes.my, "/my");
  assert.equal(routes.savedItems, "/my/saved");
  assert.equal(routes.notices, "/my/support/notices");
  assert.equal(routes.faq, "/my/support/faq");
  assert.equal(routes.feedback, "/my/support/feedback");
});

test("로그인과 온보딩 단계가 순서대로 등록된다", () => {
  assert.equal(routes.login, "/login");
  assert.equal(routes.onboardingTerms, "/onboarding/terms");
  assert.equal(routes.onboardingProfile, "/onboarding/profile");
  assert.equal(routes.onboardingPreferences, "/onboarding/preferences");
  assert.equal(routes.onboardingComplete, "/onboarding/complete");
  assert.equal(routes.invite, "/invite/:inviteId");
  assert.equal(routes.policyDetail, "/my/account/policies/:policyId");
  assert.equal(policyPath("service"), "/my/account/policies/service");
  assert.equal(policyPath("privacy", true), "/terms/privacy?from=login");
});

test("직접 일정 만들기 모드는 AI 여행 만들기와 분리된다", () => {
  assert.equal(isDirectTripMode("?mode=direct"), true);
  assert.equal(isDirectTripMode("?mode=manual"), true);
  assert.equal(isDirectTripMode("?mock=direct-search-empty"), true);
  assert.equal(isDirectTripMode(""), false);
  assert.equal(isDirectTripMode("?mode=ai"), false);
});

test("코스 둘러보기 카드는 여행자 코스 상세 경로로 이어진다", () => {
  assert.equal(travelerCoursePath("kyoto-walk"), "/courses/kyoto-walk");
  assert.equal(travelerCoursePath("교토 산책"), "/courses/%EA%B5%90%ED%86%A0%20%EC%82%B0%EC%B1%85");
});

test("가져온 코스는 마이트립 상세 경로로 이어진다", () => {
  assert.equal(importedTripPath("kyoto"), "/my-trips/kyoto");
});

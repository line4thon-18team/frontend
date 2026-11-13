import assert from "node:assert/strict";
import test from "node:test";
import {
  countEnabledNotifications,
  defaultNotificationSettings,
  defaultGoogleMapsSettings,
  parseGoogleMapsSettings,
  parseNotificationSettings,
  parseProfileSettings,
  validateNickname,
  validateNicknameFormat,
} from "../src/utils/mySettings.ts";

test("프로필 닉네임 형식과 중복 상태를 구분한다", () => {
  assert.equal(validateNickname("새닉네임").tone, "success");
  assert.equal(validateNickname("도틀로").message, "이미 사용 중인 닉네임이에요");
  assert.equal(validateNickname("예빈!").message, "한글, 영문, 숫자만 입력할 수 있어요");
  assert.equal(validateNickname("한").valid, false);
});

test("실가입용 닉네임 형식 검사는 데모 중복 목록을 사용하지 않는다", () => {
  assert.equal(validateNicknameFormat(" 도틀로 ").valid, true);
  assert.equal(validateNicknameFormat("도틀로!").valid, false);
});

test("Google Maps 연동 설정은 선택한 목록을 안전하게 복원한다", () => {
  const parsed = parseGoogleMapsSettings(JSON.stringify(defaultGoogleMapsSettings));
  assert.deepEqual(parsed?.selectedListIds, ["osaka-food", "tokyo-places", "kyoto-trip"]);
  assert.equal(parseGoogleMapsSettings('{"linked":true}'), null);
});

test("알림 설정은 피그마 기본 상태와 활성 개수를 유지한다", () => {
  assert.equal(countEnabledNotifications(defaultNotificationSettings), 5);
  assert.equal(
    parseNotificationSettings(JSON.stringify(defaultNotificationSettings))?.voteResults,
    false,
  );
  assert.equal(parseNotificationSettings('{"allNotifications":true}'), null);
});

test("전체 알림을 끄면 활성 개수가 0이 되고 다시 켜면 이전 개수로 돌아간다", () => {
  const settings = { ...defaultNotificationSettings, tripReminder: false, voteResults: true };
  const disabledSettings = { ...settings, allNotifications: false };
  const savedSettings = parseNotificationSettings(JSON.stringify(disabledSettings));

  assert.deepEqual(savedSettings, disabledSettings);
  assert.equal(countEnabledNotifications(disabledSettings), 0);

  const restoredSettings = { ...disabledSettings, allNotifications: true };
  assert.deepEqual(restoredSettings, settings);
  assert.equal(countEnabledNotifications(restoredSettings), 5);
});

test("저장된 프로필 데이터는 올바른 형식일 때만 복원한다", () => {
  const profile = JSON.stringify({
    nickname: "서희",
    email: "seohui@example.com",
    introduction: "여행을 좋아해요",
    avatar: "purple",
  });
  assert.equal(parseProfileSettings(profile)?.nickname, "서희");
  assert.equal(parseProfileSettings('{"nickname":"서희"}'), null);
  assert.equal(parseProfileSettings("broken"), null);
});

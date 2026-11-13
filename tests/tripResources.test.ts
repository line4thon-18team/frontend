import assert from "node:assert/strict";
import test from "node:test";
import { tripResourceWarning } from "../src/utils/tripResources.ts";

test("여행 부가 응답이 모두 성공하면 경고를 만들지 않는다", () => {
  assert.equal(
    tripResourceWarning({ places: false, reservations: false }),
    "",
  );
});

test("실패한 여행 부가 응답을 사용자에게 구체적으로 알린다", () => {
  assert.match(
    tripResourceWarning({ places: true, reservations: false }),
    /저장 장소/,
  );
  assert.match(
    tripResourceWarning({ places: false, reservations: true }),
    /예약 정보/,
  );
  assert.match(
    tripResourceWarning({ places: true, reservations: true }),
    /저장 장소·예약 정보/,
  );
});

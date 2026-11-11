import assert from "node:assert/strict";
import test from "node:test";
import { createRequestLock } from "../src/utils/requestLock.ts";

test("진행 중인 AI 요청은 중복으로 잠글 수 없다", () => {
  const lock = createRequestLock();

  assert.equal(lock.acquire(), true);
  assert.equal(lock.isLocked(), true);
  assert.equal(lock.acquire(), false);
});

test("AI 요청이 끝나면 다시 실행할 수 있다", () => {
  const lock = createRequestLock();

  assert.equal(lock.acquire(), true);
  lock.release();
  assert.equal(lock.isLocked(), false);
  assert.equal(lock.acquire(), true);
});

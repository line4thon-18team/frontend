import type { Preferences } from "../../types/trip";
import { mockSavedPlacesByCity, mockTripScenario } from "./tripData";

export function waitForMock(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("취소됨", "AbortError"));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      reject(new DOMException("취소됨", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
export async function importMockPlaces(city: string, signal: AbortSignal) {
  await waitForMock(mockTripScenario.importDelay, signal);
  if (mockTripScenario.importFailure)
    throw new Error("장소를 불러오지 못했어요. 다시 시도해 주세요.");
  return mockTripScenario.emptyImport
    ? []
    : (mockSavedPlacesByCity[city] ?? []);
}
export async function analyzeMockPreferences(
  text: string,
  signal: AbortSignal,
): Promise<Preferences> {
  await waitForMock(mockTripScenario.analysisDelay, signal);
  if (mockTripScenario.analysisFailure)
    return {
      text,
      tastes: [],
      pace: ["보통 강도"],
      companion: [],
      analyzed: true,
    };
  const tastes: string[] = [];
  const pace: string[] = [];
  const companion: string[] = [];
  if (/맛집|먹|미식|음식/.test(text)) tastes.push("미식");
  if (/야경|밤/.test(text)) tastes.push("야경");
  if (/관광|명소|유명/.test(text)) tastes.push("관광");
  if (/카페|커피/.test(text)) tastes.push("카페");
  if (/쇼핑|편집숍/.test(text)) tastes.push("쇼핑");
  if (/안 걷|덜 걷|많이.*걷|부모/.test(text)) pace.push("덜 걷기");
  if (/여유|쉬|부모/.test(text)) pace.push("여유롭게");
  if (!pace.length) pace.push("보통 강도");
  for (const label of ["혼자", "친구", "연인", "부모님", "가족"])
    if (text.includes(label)) companion.push(label);
  return { text, tastes, pace, companion, analyzed: true };
}
export async function generateMockTrip(
  signal: AbortSignal,
  onProgress: (step: number) => void,
) {
  for (let step = 0; step < 4; step++) {
    onProgress(step);
    await waitForMock(mockTripScenario.generationDelay, signal);
  }
  if (mockTripScenario.generationFailures > 0) {
    mockTripScenario.generationFailures--;
    throw new Error("일정을 만들지 못했어요. 다시 시도해 주세요");
  }
}

export async function requestMockAiEdit(
  signal: AbortSignal,
  onProgress: (step: number) => void,
): Promise<void> {
  for (let step = 0; step < 4; step++) {
    onProgress(step);
    await waitForMock(450, signal);
  }
}

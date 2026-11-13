import { useEffect, useRef, useState } from "react";
import type { TripDraft } from "../../types/trip";
import { preferenceExamples } from "../../data/tripData";
import { analyzeMockPreferences } from "../../data/mocks/tripService";
import {
  isServerTripId,
  preferenceAnalysisToDraft,
  preferenceResultToDraft,
} from "../../api/adapters";
import { shouldUseMockFallback } from "../../api/client";
import { isApiEnabled } from "../../api/config";
import { hasAuthSession } from "../../api/tokenStorage";
import {
  analyzePreferences,
  getPreferences,
  getUserPreferences,
  savePreferences,
} from "../../api/preferences";
import sparkle from "../../assets/icons/status-ai-sparkle.svg";
import * as S from "./Trip.styled";
import * as P from "./PreferencesStep.styled";

interface PreferencesStepProps {
  draft: TripDraft;
  onChange: (draft: TripDraft) => void;
  onGenerate: () => Promise<void>;
  error: string;
}
function PreferencesStep({
  draft,
  onChange,
  onGenerate,
  error,
}: PreferencesStepProps) {
  const [busy, setBusy] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const request = useRef<AbortController | null>(null);
  const hydration = useRef<AbortController | null>(null);
  const hydratedTripId = useRef<string | null>(null);
  useEffect(
    () => () => {
      request.current?.abort();
      hydration.current?.abort();
    },
    [],
  );
  const preferences = draft.preferences;

  useEffect(() => {
    const hasLocalPreferences = Boolean(
      preferences.text.trim() ||
        preferences.tastes.length ||
        preferences.pace.length ||
        preferences.apiProfile,
    );
    if (
      hasLocalPreferences ||
      !isApiEnabled() ||
      !hasAuthSession() ||
      !isServerTripId(draft.tripId) ||
      hydratedTripId.current === draft.tripId
    ) {
      return;
    }

    const controller = new AbortController();
    hydratedTripId.current = draft.tripId;
    hydration.current = controller;
    setLoadingPreferences(true);
    setAnalysisError("");

    void getPreferences(Number(draft.tripId), controller.signal)
      .then(async (tripPreferences) => {
        if (tripPreferences.saved) return tripPreferences;
        return getUserPreferences(controller.signal);
      })
      .then((initialPreferences) => {
        if (controller.signal.aborted) return;
        onChange({
          ...draft,
          preferences: preferenceResultToDraft(initialPreferences, draft),
        });
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted || shouldUseMockFallback(reason)) return;
        setAnalysisError(
          reason instanceof Error
            ? reason.message
            : "저장된 여행 취향을 불러오지 못했어요.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingPreferences(false);
        if (hydration.current === controller) hydration.current = null;
      });

    return () => controller.abort();
  }, [
    draft,
    onChange,
    preferences.apiProfile,
    preferences.pace.length,
    preferences.tastes.length,
    preferences.text,
  ]);

  function changeText(text: string) {
    hydration.current?.abort();
    hydration.current = null;
    request.current?.abort();
    request.current = null;
    setBusy(false);
    setLoadingPreferences(false);
    setAnalysisError("");
    onChange({
      ...draft,
      preferences: { ...preferences, text, analyzed: false },
    });
  }
  async function submit() {
    if (preferences.analyzed) {
      if (submitting) return;
      setSubmitting(true);
      try {
        if (
          isApiEnabled() &&
          hasAuthSession() &&
          isServerTripId(draft.tripId) &&
          preferences.apiProfile
        ) {
          try {
            await savePreferences(Number(draft.tripId), {
              ...preferences.apiProfile,
              rawText: preferences.text,
            });
          } catch (reason) {
            if (!shouldUseMockFallback(reason)) {
              setAnalysisError(
                reason instanceof Error
                  ? reason.message
                  : "여행 취향을 저장하지 못했어요. 다시 시도해 주세요.",
              );
              return;
            }
          }
        }
        await onGenerate();
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (!preferences.text.trim()) {
      onChange({ ...draft, preferences: { ...preferences, analyzed: true } });
      return;
    }
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setAnalysisError("");
    try {
      let nextPreferences: TripDraft["preferences"];
      if (
        isApiEnabled() &&
        hasAuthSession() &&
        isServerTripId(draft.tripId)
      ) {
        try {
          const result = await analyzePreferences(
            Number(draft.tripId),
            preferences.text,
            controller.signal,
          );
          nextPreferences = preferenceAnalysisToDraft(result, draft);
        } catch (reason) {
          if (!shouldUseMockFallback(reason)) throw reason;
          const result = await analyzeMockPreferences(
            preferences.text,
            controller.signal,
          );
          nextPreferences = {
            ...result,
            companion: result.companion.length
              ? result.companion
              : draft.companion
                ? [draft.companion]
                : [],
          };
        }
      } else {
        const result = await analyzeMockPreferences(
          preferences.text,
          controller.signal,
        );
        nextPreferences = {
          ...result,
          companion: result.companion.length
            ? result.companion
            : draft.companion
              ? [draft.companion]
              : [],
        };
      }
      if (!controller.signal.aborted)
        onChange({
          ...draft,
          preferences: nextPreferences,
        });
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === "AbortError")) {
        setAnalysisError(
          reason instanceof Error
            ? reason.message
            : "여행 취향을 정리하지 못했어요. 다시 시도해 주세요.",
        );
      }
    } finally {
      if (request.current === controller) {
        request.current = null;
        setBusy(false);
      }
    }
  }
  const hasConditions =
    preferences.text.trim() ||
    preferences.tastes.length ||
    preferences.pace.length ||
    preferences.companion.length;
  if (busy) {
    return (
      <P.AnalysisProgress role="status">
        <span aria-hidden="true" />
        <p>여행 취향을 분석하고 있어요</p>
      </P.AnalysisProgress>
    );
  }

  return (
    <>
      <P.Preferences>
        <div>
          <S.Title>어떤 여행을 원하세요?</S.Title>
          <S.Subtitle>편하게 말해주면 AI가 코스에 맞게 정리해요</S.Subtitle>
        </div>
        <P.Prompt $active={!!preferences.text} $analyzed={preferences.analyzed}>
          <textarea
            aria-label="원하는 여행"
            maxLength={200}
            placeholder="예) 맛집 위주로 먹고 싶고, 밤에는 야경도 보고 싶어요"
            value={preferences.text}
            onChange={(event) => changeText(event.target.value)}
          />
          <span>{preferences.text.length} / 200</span>
        </P.Prompt>
        {preferences.analyzed ? (
          <P.Analysis>
            <header>
              <img src={sparkle} alt="" />
              AI가 이렇게 이해했어요
            </header>
            {(["tastes", "pace", "companion"] as const).map((group, index) => (
              <section key={group}>
                <span>{["취향", "방식", "동행"][index]}</span>
                <S.Chips>
                  {preferences[group].map((value, valueIndex) => (
                    <P.AnalysisChip key={value}>
                      {group === "tastes" && (
                        <P.TasteNumber>{valueIndex + 1}</P.TasteNumber>
                      )}
                      {value}
                    </P.AnalysisChip>
                  ))}
                </S.Chips>
              </section>
            ))}
          </P.Analysis>
        ) : (
          <div>
            <P.ExampleTitle>이렇게 시작해 보세요</P.ExampleTitle>
            <S.Chips>
              {preferenceExamples.map((example) => (
                <S.Chip
                  type="button"
                  key={example}
                  onClick={() => changeText(example)}
                >
                  {example}
                </S.Chip>
              ))}
            </S.Chips>
          </div>
        )}
      </P.Preferences>
      <S.Footer>
        {(error || analysisError) && (
          <S.ErrorText role="alert">{error || analysisError}</S.ErrorText>
        )}
        <S.Primary
          type="button"
          disabled={loadingPreferences || submitting || !hasConditions}
          onClick={submit}
        >
          {loadingPreferences
            ? "저장된 취향을 불러오고 있어요"
            : submitting
              ? "코스를 만들고 있어요"
            : preferences.analyzed
              ? "이대로 코스 만들기"
              : "코스 만들기"}
        </S.Primary>
      </S.Footer>
    </>
  );
}
export default PreferencesStep;

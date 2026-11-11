import { useEffect, useRef, useState } from "react";
import type { TripDraft } from "../../types/trip";
import { preferenceExamples } from "../../data/tripData";
import { analyzeMockPreferences } from "../../data/mocks/tripService";
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
  const [submitting, setSubmitting] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const preferences = draft.preferences;
  function changeText(text: string) {
    request.current?.abort();
    request.current = null;
    setBusy(false);
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
    try {
      const result = await analyzeMockPreferences(
        preferences.text,
        controller.signal,
      );
      if (!controller.signal.aborted)
        onChange({
          ...draft,
          preferences: {
            ...result,
            companion: result.companion.length
              ? result.companion
              : draft.companion
                ? [draft.companion]
                : [],
          },
        });
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === "AbortError"))
        onChange({
          ...draft,
          preferences: { ...preferences, pace: ["보통 강도"], analyzed: true },
        });
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
        {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
        <S.Primary
          type="button"
          disabled={busy || submitting || !hasConditions}
          onClick={submit}
        >
          {busy
            ? "여행 취향을 정리하고 있어요"
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

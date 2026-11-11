import { useState } from "react";
import { useLocation } from "react-router";
import useTripCreate from "../hooks/useTripCreate";
import Layout from "../components/common/Layout";
import DirectTripBuilder from "../components/direct-trip/DirectTripBuilder";
import TripInfoStep from "../components/trip/TripInfoStep";
import SavedPlacesStep from "../components/trip/SavedPlacesStep";
import PreferencesStep from "../components/trip/PreferencesStep";
import { durationLabel } from "../utils/trip";
import logo from "../assets/images/brand-dotlo-logo.png";
import generationPurple from "../assets/icons/effect-generation-purple.svg";
import generationCyan from "../assets/icons/effect-generation-cyan.svg";
import done from "../assets/icons/status-generation-done.svg";
import current from "../assets/icons/status-generation-current.svg";
import pending from "../assets/icons/status-generation-pending.svg";
import { isDirectTripMode } from "../utils/navigation";
import * as S from "./TripCreatePage.styled";

function TripCreatePage() {
  const location = useLocation();
  return isDirectTripMode(location.search) ? <DirectTripBuilder /> : <AiTripCreatePage />;
}

function AiTripCreatePage() {
  const [importing, setImporting] = useState(false);
  const {
    draft,
    step,
    generating,
    progress,
    error,
    phases,
    update,
    move,
    back,
    generate,
  } = useTripCreate();

  let content = (
    <TripInfoStep draft={draft} onChange={update} onNext={() => move(2)} />
  );
  if (step === 2)
    content = (
      <SavedPlacesStep
        draft={draft}
        onChange={update}
        onNext={() => move(3)}
        onLoadingChange={setImporting}
      />
    );
  if (step === 3)
    content = (
      <PreferencesStep
        draft={draft}
        onChange={update}
        onGenerate={generate}
        error={error}
      />
    );
  if (generating)
    content = (
      <S.Generation role="status" aria-live="polite">
        <S.GenerationGlow src={generationPurple} alt="" $tone="purple" />
        <S.GenerationGlow src={generationCyan} alt="" $tone="cyan" />
        <S.SymbolBox>
          <div>
            <img src={logo} alt="Dotlo" />
          </div>
        </S.SymbolBox>
        <div>
          <h1>
            {draft.city} {durationLabel(draft.startDate, draft.endDate)} 코스를
            <br />
            만들고 있어요
          </h1>
          <p>최대 3분 정도 걸릴 수 있어요</p>
          <S.GenerationNotice>화면을 닫지 않고 잠시 기다려 주세요</S.GenerationNotice>
        </div>
        <S.GenerationSteps>
          {phases.map((phase, index) => (
            <li key={phase} data-pending={index > progress}>
              <img
                src={
                  index < progress
                    ? done
                    : index === progress
                      ? current
                      : pending
                }
                alt={
                  index < progress
                    ? "완료"
                    : index === progress
                      ? "진행 중"
                      : "대기"
                }
              />
              {phase}
            </li>
          ))}
        </S.GenerationSteps>
      </S.Generation>
    );
  return (
    <Layout
      variant="trip"
      step={step}
      onBack={back}
      hideProgress={generating || importing}
      backDisabled={generating}
    >
      {content}
    </Layout>
  );
}
export default TripCreatePage;

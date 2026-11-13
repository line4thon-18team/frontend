import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import useTripCreate from "../hooks/useTripCreate";
import Layout from "../components/common/Layout";
import DirectTripBuilder from "../components/direct-trip/DirectTripBuilder";
import TripInfoStep from "../components/trip/TripInfoStep";
import SavedPlacesStep from "../components/trip/SavedPlacesStep";
import ServerSavedPlaces from "../components/trip/ServerSavedPlaces";
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
import { isServerTripId, savedPlaceToTripPlace } from "../api/adapters";
import { getSavedPlaces } from "../api/places";
import { getTrip } from "../api/trips";
import { getReservations } from "../api/reservations";
import type { ReservationResponse, TripResponse } from "../api/types";
import { routes } from "../config/routes";
import type { TripPlace } from "../types/trip";
import { isApiEnabled } from "../api/config";
import { hasAuthSession } from "../api/tokenStorage";
import { tripResourceWarning } from "../utils/tripResources";

function TripCreatePage() {
  const location = useLocation();
  const tripId = new URLSearchParams(location.search).get("tripId");
  if (tripId !== null) {
    return isServerTripId(tripId)
      ? <ResumeTrip key={tripId} tripId={Number(tripId)} />
      : <p role="alert">여행 주소를 확인해 주세요.</p>;
  }
  return isDirectTripMode(location.search) ? <DirectTripBuilder /> : <AiTripCreatePage />;
}

function ResumeTrip({ tripId }: { tripId: number }) {
  const [resumed, setResumed] = useState<{
    trip: TripResponse;
    places?: TripPlace[];
    reservations?: ReservationResponse;
    loadWarning: string;
  }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    void getTrip(tripId, signal).then(async (trip) => {
      if (signal.aborted) return;
      const [savedResult, reservationsResult] = await Promise.allSettled([
        getSavedPlaces(tripId, signal),
        getReservations(tripId, signal),
      ]);
      if (!signal.aborted) {
        const saved = savedResult.status === "fulfilled" ? savedResult.value : undefined;
        const reservations = reservationsResult.status === "fulfilled"
          ? reservationsResult.value
          : undefined;
        setResumed({
          trip,
          places: saved?.places.map((place) => savedPlaceToTripPlace(place, trip.city)),
          reservations,
          loadWarning: tripResourceWarning({
            places: savedResult.status === "rejected",
            reservations: reservationsResult.status === "rejected",
          }),
        });
      }
    }).catch(() => { if (!signal.aborted) setError(true); });
    return () => controller.abort();
  }, [tripId]);

  if (resumed) return (
    <AiTripCreatePage
      trip={resumed.trip}
      places={resumed.places}
      reservations={resumed.reservations}
      initialLoadWarning={resumed.loadWarning}
    />
  );

  return (
    <Layout variant="trip" step={1}>
      {error ? (
        <>
          <p role="alert">이어서 만들 여행을 불러오지 못했어요.</p>
          <Link to={routes.home}>홈으로 돌아가기</Link>
        </>
      ) : <p role="status">여행 정보를 불러오고 있어요.</p>}
    </Layout>
  );
}

function AiTripCreatePage({
  trip,
  places,
  reservations,
  initialLoadWarning = "",
}: {
  trip?: TripResponse;
  places?: TripPlace[];
  reservations?: ReservationResponse;
  initialLoadWarning?: string;
}) {
  const [importing, setImporting] = useState(false);
  const {
    draft,
    step,
    generating,
    progress,
    error,
    preparingTrip,
    phases,
    update,
    move,
    back,
    startPlacesStep,
    generate,
  } = useTripCreate(trip, places, reservations);

  let content = (
    <TripInfoStep
      draft={draft}
      onChange={update}
      onNext={startPlacesStep}
      submitting={preparingTrip}
      submitError={step === 1 ? error : ""}
    />
  );
  if (step === 2)
    content = isApiEnabled() && hasAuthSession() && isServerTripId(draft.tripId) ? (
      <ServerSavedPlaces
        key={draft.tripId}
        tripId={Number(draft.tripId)}
        onContinue={(saved) => {
          const places = saved.map((place) => savedPlaceToTripPlace(place, draft.city));
          update({
            ...draft,
            places,
            source: "manual",
            selectedPlaceIds: places.filter((place) => place.placeId && !place.closed && !place.needsMatch).map((place) => place.id),
          });
          move(3);
        }}
      />
    ) : (
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
      {initialLoadWarning && <S.LoadWarning role="alert">{initialLoadWarning}</S.LoadWarning>}
      {content}
    </Layout>
  );
}
export default TripCreatePage;

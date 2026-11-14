import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ApiError } from "../api/client";
import { getSharedTrip, type SharedTrip } from "../api/trips";
import TripSummary from "../components/course-completion/TripSummary";
import TripTimeline from "../components/course-completion/TripTimeline";
import { formatTripDateRange } from "../utils/importedTrip";
import { companionLabels } from "../utils/serverTrip";
import { dateLabel, durationLabel, timeLabel } from "../utils/trip";
import "../components/course-completion/CourseCompletion.css";
import "../components/course-completion/CourseEdit.css";

export default function SharedTripPage() {
  const { token = "" } = useParams();
  return <SharedTripDetails key={token} token={token} />;
}

function SharedTripDetails({ token }: { token: string }) {
  const [data, setData] = useState<SharedTrip>();
  const [error, setError] = useState<"invalid" | "unavailable" | "retry">();
  const [attempt, setAttempt] = useState(0);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    void getSharedTrip(token, signal).then(
      (result) => { if (!signal.aborted) setData(result); },
      (reason: unknown) => {
        if (signal.aborted) return;
        if (reason instanceof ApiError && reason.code === "ITINERARY_NOT_FOUND") {
          setError("unavailable");
        } else if (reason instanceof ApiError && (reason.code === "SHARE_NOT_FOUND" || reason.status === 404)) {
          setError("invalid");
        } else {
          setError("retry");
        }
      },
    );
    return () => controller.abort();
  }, [token, attempt]);

  return (
    <div className="course-page-shell">
      <main className="course-page">
        <div className="course-content">
          {!data && !error && <p role="status">공유 일정을 불러오고 있어요.</p>}
          {error === "invalid" && <p role="alert">유효하지 않은 공유 링크예요.</p>}
          {error === "unavailable" && <p role="alert">이 여행에 공유할 일정이 없어요.</p>}
          {error === "retry" && (
            <>
              <p role="alert">공유 일정을 불러오지 못했어요.</p>
              <button className="course-inline-edit" type="button" onClick={() => {
                setError(undefined);
                setAttempt((value) => value + 1);
              }}>다시 시도</button>
            </>
          )}
          {data && <SharedItinerary data={data} activeDay={activeDay} onDayChange={setActiveDay} />}
        </div>
      </main>
    </div>
  );
}

function SharedItinerary({ data, activeDay, onDayChange }: {
  data: SharedTrip;
  activeDay: number;
  onDayChange: (day: number) => void;
}) {
  const { trip, itinerary, places } = data;
  const duration = durationLabel(trip.startDate, trip.endDate);
  const days = itinerary.draft.days;
  const day = days[activeDay];
  const placesById = new Map(places.map((place) => [place.placeId, place]));
  const schedule = itinerary.validation.days.find((item) => item.date === day?.date);
  const visitsById = new Map(schedule?.visits.map((visit) => [visit.itemId, visit]));

  return (
    <section className="course-section">
      <h1>{trip.city} {duration}</h1>
      <p>{formatTripDateRange(trip.startDate, trip.endDate)}</p>
      <div className="server-course-summary">
        <TripSummary
          duration={duration}
          placeCount={new Set(days.flatMap((item) => item.visits.map((visit) => visit.placeId))).size}
          companion={`${companionLabels[trip.companion]} ${trip.companionCount}명`}
        />
      </div>
      <h2>일정</h2>
      <div className="course-tabs" aria-label="여행 일차">
        {days.map((item, index) => (
          <button key={item.date} type="button" className={activeDay === index ? "is-active" : ""}
            aria-pressed={activeDay === index} onClick={() => onDayChange(index)}>
            <strong>{index + 1}일차</strong>
            <span>{dateLabel(item.date)}</span>
          </button>
        ))}
      </div>
      {day ? <TripTimeline day={activeDay + 1} visits={day.visits.map((visit, index) => {
        const place = placesById.get(visit.placeId);
        const scheduled = visit.itemId ? visitsById.get(visit.itemId) : undefined;
        return {
          id: visit.itemId ?? String(index),
          name: place?.name,
          address: place?.address,
          timing: scheduled && `${timeLabel(scheduled.start)} – ${timeLabel(scheduled.end)}`,
        };
      })} /> : <p>공유된 일정이 없어요.</p>}
    </section>
  );
}

interface TimelineVisit {
  id: string;
  name?: string;
  address?: string | null;
  timing?: string;
}

export default function TripTimeline({ day, visits }: { day: number; visits: TimelineVisit[] }) {
  if (!visits.length) return <p>이날 일정에 담긴 장소가 없어요.</p>;
  return (
    <ol className="server-course-timeline" aria-label={`${day}일차 장소 타임라인`}>
      {visits.map(({ id, name, address, timing }) => (
        <li key={id}>
          <strong>{name ?? "장소 정보 없음"}</strong>
          {address && <small>{address}</small>}
          {timing && <p>{timing}</p>}
        </li>
      ))}
    </ol>
  );
}

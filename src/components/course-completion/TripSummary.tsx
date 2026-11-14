export default function TripSummary({ duration, placeCount, companion }: {
  duration: string;
  placeCount: number;
  companion: string;
}) {
  return (
    <ul aria-label="여행 요약">
      <li><strong>{duration}</strong><small>여행 기간</small></li>
      <li><strong>{placeCount}곳</strong><small>일정에 담긴 장소</small></li>
      <li><strong>{companion}</strong><small>동행</small></li>
    </ul>
  );
}

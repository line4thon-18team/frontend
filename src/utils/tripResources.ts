export interface TripResourceWarnings {
  places: boolean;
  reservations: boolean;
}

export function tripResourceWarning({
  places,
  reservations,
}: TripResourceWarnings) {
  const failed: string[] = [];
  if (places) failed.push("저장 장소");
  if (reservations) failed.push("예약 정보");
  if (!failed.length) return "";
  return `${failed.join("·")}를 불러오지 못했어요. 입력한 여행 기본정보는 정상적으로 불러왔습니다.`;
}

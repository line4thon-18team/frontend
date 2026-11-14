import type {
  Companion,
  TripDraft,
  TripPlace,
  Stay,
} from "../types/trip";

export const DRAFT_KEY = "dotlo:trip-draft:v1";
export const companions: Companion[] = ["혼자", "친구", "연인", "가족"];
export function emptyDraft(): TripDraft {
  return {
    version: 1,
    tripId: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    companion: null,
    people: 1,
    outbound: null,
    inbound: null,
    stays: [],
    rental: null,
    places: [],
    selectedPlaceIds: [],
    source: "none",
    preferences: {
      text: "",
      tastes: [],
      pace: [],
      companion: [],
      analyzed: false,
    },
  };
}
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T12:00:00Z");
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function addDays(value: string, count: number): string {
  const date = new Date(value + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}
export function dayCount(start: string, end: string): number {
  return (
    Math.round(
      (Date.parse(end + "T12:00:00Z") - Date.parse(start + "T12:00:00Z")) /
        86400000,
    ) + 1
  );
}
export function rangeDates(start: string, end: string): string[] {
  if (!validDate(start) || !validDate(end) || end < start) return [];
  return Array.from({ length: dayCount(start, end) }, (_, i) =>
    addDays(start, i),
  );
}
export function dateLabel(value: string): string {
  if (!validDate(value)) return "";
  const date = new Date(value + "T12:00:00Z");
  return `${date.getUTCMonth() + 1}.${date.getUTCDate()} ${["일", "월", "화", "수", "목", "금", "토"][date.getUTCDay()]}`;
}
export function durationLabel(start: string, end: string): string {
  const days = dayCount(start, end);
  return days === 1 ? "당일치기" : `${days - 1}박 ${days}일`;
}
export function basicError(draft: TripDraft): string {
  if (!draft.city) return "도시 하나를 골라주세요.";
  if (!validDate(draft.startDate) || !validDate(draft.endDate))
    return "여행 날짜를 선택해 주세요.";
  if (draft.endDate < draft.startDate) return "종료일이 시작일보다 빨라요";
  if (!draft.companion) return "누구와 떠나는지 선택해 주세요.";
  if (!Number.isInteger(draft.people) || draft.people < 1 || draft.people > 10)
    return "최대 10명까지 함께할 수 있어요";
  if (draft.companion === "혼자" && draft.people !== 1)
    return "혼자 떠나는 여행은 1명이에요.";
  if (draft.companion === "연인" && draft.people !== 2)
    return "연인과는 둘이 떠나요.";
  if (
    (draft.companion === "친구" || draft.companion === "가족") &&
    draft.people < 2
  )
    return "2명부터 10명까지 선택할 수 있어요";
  return "";
}
export function selectedPlaces(draft: TripDraft): TripPlace[] {
  const ids = new Set(draft.selectedPlaceIds);
  return draft.places.filter((place) => ids.has(place.id));
}
export function placesError(draft: TripDraft): string {
  const places = selectedPlaces(draft);
  if (!places.length) return "장소를 선택해 주세요";
  if (places.some((p) => p.needsMatch || !p.city))
    return "선택한 장소의 정보를 확인해 주세요.";
  if (places.some((p) => p.city !== draft.city || p.closed))
    return "여행 도시와 장소 정보를 다시 확인해 주세요.";
  return "";
}
export function validateStays(
  stays: Stay[],
  start: string,
  end: string,
): string {
  if (
    stays.some(
      (stay) =>
        !stay.name.trim() ||
        !validDate(stay.startDate) ||
        !validDate(stay.endDate) ||
        stay.startDate < start ||
        stay.endDate > end ||
        stay.endDate <= stay.startDate,
    )
  )
    return "숙소 날짜는 여행 기간 안에서 골라주세요.";
  const sorted = [...stays].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
  if (sorted.some((stay, i) => i > 0 && stay.startDate < sorted[i - 1].endDate))
    return "숙소 일정이 겹쳐요. 날짜를 다시 골라주세요.";
  return "";
}
export function changeDates(
  draft: TripDraft,
  start: string,
  end: string,
): TripDraft {
  const stays = draft.stays
    .map((stay) => ({
      ...stay,
      startDate: stay.startDate < start ? start : stay.startDate,
      endDate: stay.endDate > end ? end : stay.endDate,
    }))
    .filter(
      (stay) =>
        stay.endDate > stay.startDate &&
        stay.startDate < end &&
        stay.endDate > start,
    );
  const days = rangeDates(start, end);
  const rental = draft.rental
    ? {
        ...draft.rental,
        days: draft.rental.days.filter((day) => days.includes(day)),
      }
    : null;
  return {
    ...draft,
    startDate: start,
    endDate: end,
    outbound: draft.outbound?.date === start ? draft.outbound : null,
    inbound: draft.inbound?.date === end ? draft.inbound : null,
    stays,
    rental: rental?.days.length ? rental : null,
  };
}
export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}
export function mergePlaces(
  existing: TripPlace[],
  incoming: TripPlace[],
): TripPlace[] {
  const result = [...existing];
  const ids = new Set(existing.map((place) => place.id));
  const key = (place: TripPlace) =>
    JSON.stringify([place.city, place.title.trim().toLowerCase()]);
  const names = new Set(existing.map(key));
  for (const place of incoming) {
    const name = key(place);
    if (ids.has(place.id) || names.has(name)) continue;
    ids.add(place.id);
    names.add(name);
    result.push(place);
  }
  return result;
}
export function readDraft(value: string | null): TripDraft {
  if (!value) return emptyDraft();
  try {
    const d = JSON.parse(value) as TripDraft;
    const strings = [d.city, d.country, d.startDate, d.endDate, d.tripId];
    if (
      !d ||
      d.version !== 1 ||
      strings.some((v) => typeof v !== "string") ||
      (!companions.includes(d.companion as Companion) &&
        d.companion !== null) ||
      !Number.isInteger(d.people) ||
      d.people < 1 ||
      d.people > 10 ||
      !["none", "file", "manual", "mock"].includes(d.source) ||
      !Array.isArray(d.stays) ||
      !Array.isArray(d.places) ||
      !Array.isArray(d.selectedPlaceIds)
    )
      return emptyDraft();
    if (
      (d.startDate && !validDate(d.startDate)) ||
      (d.endDate && !validDate(d.endDate))
    )
      return emptyDraft();
    if (
      d.places.some(
        (p) =>
          !p ||
          typeof p.id !== "string" ||
          typeof p.title !== "string" ||
          typeof p.city !== "string" ||
          typeof p.description !== "string" ||
          typeof p.image !== "string" ||
          !["맛집", "카페", "명소", "쇼핑", "산책"].includes(p.category),
      ) ||
      d.selectedPlaceIds.some((id) => typeof id !== "string")
    )
      return emptyDraft();
    if (
      !d.preferences ||
      typeof d.preferences.text !== "string" ||
      ["tastes", "pace", "companion"].some(
        (key) =>
          !Array.isArray(d.preferences[key as "tastes"]) ||
          d.preferences[key as "tastes"].some((v) => typeof v !== "string"),
      )
    )
      return emptyDraft();
    if (
      d.stays.some(
        (s) =>
          !s ||
          typeof s.name !== "string" ||
          typeof s.id !== "string" ||
          typeof s.address !== "string" ||
          typeof s.city !== "string" ||
          !validDate(s.startDate) ||
          !validDate(s.endDate),
      )
    )
      return emptyDraft();
    if (
      d.rental &&
      (!Array.isArray(d.rental.days) ||
        d.rental.days.some((day) => !validDate(day)) ||
        typeof d.rental.location !== "string")
    )
      return emptyDraft();
    for (const f of [d.outbound, d.inbound])
      if (
        f &&
        (typeof f.code !== "string" ||
          typeof f.airline !== "string" ||
          typeof f.from !== "string" ||
          typeof f.to !== "string" ||
          !validDate(f.date) ||
          !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(f.arrival) ||
          !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(f.departure))
      )
        return emptyDraft();
    return {
      ...d,
      selectedPlaceIds: d.selectedPlaceIds.filter((id) =>
        d.places.some((p) => p.id === id),
      ),
      preferences: { ...d.preferences, text: d.preferences.text.slice(0, 200) },
    };
  } catch {
    return emptyDraft();
  }
}
export function timeLabel(value: string) {
  return (value.split("T")[1] ?? value).slice(0, 5);
}

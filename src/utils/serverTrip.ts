import type { CompanionCode, TripResponse } from "../api/types";
import { mockTripCities } from "../data/mocks/tripData";
import type { TripSummary } from "../types/home";
import type { Companion, TripDraft } from "../types/trip";
import { formatTripDateRange } from "./importedTrip";
import { dateKey, dayCount, durationLabel, emptyDraft } from "./trip";

export const companionLabels: Record<CompanionCode, Companion> = {
  ALONE: "혼자",
  FRIEND: "친구",
  COUPLE: "연인",
  FAMILY: "가족",
};

export function apiTripToDraft(trip: TripResponse, draft = emptyDraft()): TripDraft {
  return {
    ...draft,
    tripId: String(trip.id),
    city: trip.city,
    country: mockTripCities.find((city) => city.name === trip.city)?.country ?? "",
    startDate: trip.startDate,
    endDate: trip.endDate,
    companion: companionLabels[trip.companion],
    people: trip.companionCount,
  };
}

export function apiTripToSummary(trip: TripResponse): TripSummary {
  const today = dateKey(new Date());
  const daysUntil = dayCount(today, trip.startDate) - 1;
  const duration = durationLabel(trip.startDate, trip.endDate);
  return {
    id: String(trip.id),
    title: `${trip.city} ${duration}`,
    city: trip.city,
    dateLabel: formatTripDateRange(trip.startDate, trip.endDate),
    countdownLabel: daysUntil > 0 ? `D-${daysUntil}` : daysUntil === 0 ? "D-DAY" : "",
    status: trip.endDate < today ? "past" : "upcoming",
    durationLabel: duration,
    coverImage: mockTripCities.find((city) => city.name === trip.city)?.image ?? "",
    memberAvatars: [],
  };
}

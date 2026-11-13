import { apiRequest } from "./client";
import type {
  CityResponse,
  TripInput,
  TripResponse,
  TripUpdateInput,
} from "./types";

export function getCities(signal?: AbortSignal) {
  return apiRequest<CityResponse[]>("/api/cities", { auth: false, signal });
}

export function getTrips(signal?: AbortSignal) {
  return apiRequest<TripResponse[]>("/api/trips", { signal });
}

export function getInProgressTrip(signal?: AbortSignal) {
  return apiRequest<TripResponse | undefined>("/api/trips/in-progress", { signal });
}

export function getTrip(tripId: number, signal?: AbortSignal) {
  return apiRequest<TripResponse>(`/api/trips/${tripId}`, { signal });
}

export function deleteTrip(tripId: number) {
  return apiRequest<void>(`/api/trips/${tripId}`, { method: "DELETE" });
}

export function createTrip(input: TripInput, signal?: AbortSignal) {
  return apiRequest<TripResponse>("/api/trips", {
    method: "POST",
    json: input,
    signal,
  });
}

export function updateTrip(
  tripId: number,
  input: TripUpdateInput,
  signal?: AbortSignal,
) {
  return apiRequest<TripResponse>(`/api/trips/${tripId}`, {
    method: "PATCH",
    json: input,
    signal,
  });
}


import { ApiError, apiRequest, queryString } from "./client";
import type {
  PlaceCandidate,
  PlaceCategoryCode,
  PlaceImportResponse,
  MySavedPlaceResponse,
  PopularPlaceResponse,
  SavedPlaceListResponse,
} from "./types";

export function getMySavedPlaces(signal?: AbortSignal) {
  return apiRequest<MySavedPlaceResponse[]>("/api/users/me/places", { signal });
}

export function askPlace(placeId: string, question: string, signal?: AbortSignal) {
  return apiRequest<{ answer: string }>(`/api/places/${encodeURIComponent(placeId)}/ask`, {
    method: "POST",
    json: { question },
    signal,
  });
}

export function searchPlaces(
  tripId: number,
  query: string,
  signal?: AbortSignal,
) {
  return apiRequest<PlaceCandidate[]>(
    `/api/places/search${queryString({ query, tripId })}`,
    { signal },
  );
}

export function getPopularPlaces(tripId: number, signal?: AbortSignal) {
  return apiRequest<PopularPlaceResponse[]>(
    `/api/places/popular${queryString({ tripId })}`,
    { signal },
  );
}

export interface PlaceHoursResponse {
  open24h: boolean;
  openNow: boolean;
  days: Array<{
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    hours: Array<{ open: string; close: string }>;
  }>;
}

export interface PlaceDetailResponse {
  placeId: string;
  name: string;
  category: PlaceCategoryCode | null;
  rating: number | null;
  reviewCount: number | null;
  summary: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  googleMapsUri: string | null;
  savedPlaceId: number | null;
}

export function getPlaceDetail(tripId: number, placeId: string, signal?: AbortSignal) {
  return apiRequest<PlaceDetailResponse>(
    `/api/places/${encodeURIComponent(placeId)}${queryString({ tripId })}`,
    { signal },
  );
}

export function getNearbyPlaces(
  tripId: number,
  lat: number,
  lng: number,
  category?: PlaceCategoryCode,
  signal?: AbortSignal,
) {
  return apiRequest<PlaceCandidate[]>(
    `/api/places/nearby${queryString({ tripId, lat, lng, category })}`,
    { signal },
  );
}

export function getPlaceHours(tripId: number, placeId: string, signal?: AbortSignal) {
  return apiRequest<PlaceHoursResponse | undefined>(
    `/api/places/${encodeURIComponent(placeId)}/hours${queryString({ tripId })}`,
    { signal },
  );
}

export function getSavedPlaces(tripId: number, signal?: AbortSignal) {
  return apiRequest<SavedPlaceListResponse>(`/api/trips/${tripId}/places`, {
    signal,
  });
}

export function addSavedPlace(
  tripId: number,
  placeId: string,
  signal?: AbortSignal,
) {
  return apiRequest<SavedPlaceListResponse>(`/api/trips/${tripId}/places`, {
    method: "POST",
    json: { placeId },
    signal,
  });
}

export function uploadTakeout(
  tripId: number,
  file: File,
  signal?: AbortSignal,
) {
  const form = new FormData();
  form.append("file", file);
  return apiRequest<PlaceImportResponse>(`/api/trips/${tripId}/places/upload`, {
    method: "POST",
    body: form,
    signal,
    timeoutMs: 120_000,
  });
}

export function importSharedList(
  tripId: number,
  url: string,
  signal?: AbortSignal,
) {
  return apiRequest<PlaceImportResponse>(`/api/trips/${tripId}/places/link`, {
    method: "POST",
    json: { url },
    signal,
    timeoutMs: 120_000,
  });
}

export async function enrichSavedPlaces(tripId: number, signal?: AbortSignal) {
  try {
    return await apiRequest<SavedPlaceListResponse>(
      `/api/trips/${tripId}/places/enrich`,
      { method: "POST", signal, timeoutMs: 120_000 },
    );
  } catch (reason) {
    // Import has already persisted the rows. They can be matched manually if lookup is unavailable.
    if (signal?.aborted || !(reason instanceof ApiError) || reason.code !== "EXTERNAL_API_ERROR") throw reason;
    return getSavedPlaces(tripId, signal);
  }
}

export function matchSavedPlace(
  tripId: number,
  savedPlaceId: number,
  googlePlaceId: string,
  signal?: AbortSignal,
) {
  return apiRequest<SavedPlaceListResponse>(
    `/api/trips/${tripId}/places/${savedPlaceId}/match`,
    { method: "PATCH", json: { placeId: googlePlaceId }, signal },
  );
}

export function deleteSavedPlace(
  tripId: number,
  savedPlaceId: number,
  signal?: AbortSignal,
) {
  return apiRequest<void>(`/api/trips/${tripId}/places/${savedPlaceId}`, {
    method: "DELETE",
    signal,
  });
}


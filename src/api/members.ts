import { apiRequest } from "./client";
import type {
  InvitePreviewResponse,
  InviteResponse,
  InviteAcceptResponse,
  MemberResponse,
} from "./types";

export function createInvite(tripId: number, signal?: AbortSignal) {
  return apiRequest<InviteResponse>(`/api/trips/${tripId}/invites`, {
    method: "POST",
    signal,
  });
}

export function getInvitePreview(token: string, signal?: AbortSignal) {
  return apiRequest<InvitePreviewResponse>(
    `/api/invites/${encodeURIComponent(token)}`,
    { auth: false, signal },
  );
}

export function acceptInvite(token: string, signal?: AbortSignal) {
  return apiRequest<InviteAcceptResponse>(`/api/invites/${encodeURIComponent(token)}/accept`, {
    method: "POST",
    signal,
  });
}

export function getTripMembers(tripId: number, signal?: AbortSignal) {
  return apiRequest<MemberResponse[]>(`/api/trips/${tripId}/members`, {
    signal,
  });
}

export function leaveTrip(tripId: number) {
  return apiRequest<{ tripDeleted: boolean }>(`/api/trips/${tripId}/members/me`, {
    method: "DELETE",
  });
}

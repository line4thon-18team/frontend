import { routes } from "../config/routes.ts";

export const demoInviteId = "osaka-demo";
export const demoInvitePath = routes.invite.replace(":inviteId", demoInviteId);

export function invitePath(token: string): string {
  return routes.invite.replace(":inviteId", encodeURIComponent(token));
}

const pendingInviteKey = "dotlo:auth:pending-invite";

type InviteStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function savePendingInvite(storage: InviteStorage, token: string) {
  storage.setItem(pendingInviteKey, token);
}

export function takePendingInvitePath(storage: InviteStorage): string | undefined {
  const token = storage.getItem(pendingInviteKey);
  storage.removeItem(pendingInviteKey);
  return token ? invitePath(token) : undefined;
}

export type PlanOrigin = "home" | "my-trips" | "courses" | "generated";

const planOrigins: PlanOrigin[] = ["home", "my-trips", "courses", "generated"];

export function readPlanOrigin(search: string): PlanOrigin {
  const value = new URLSearchParams(search).get("from");
  return planOrigins.includes(value as PlanOrigin)
    ? (value as PlanOrigin)
    : "home";
}

export function tripPlanPath(
  origin: PlanOrigin,
  courseId?: string,
): string {
  const params = new URLSearchParams({ from: origin });
  if (courseId) params.set("course", courseId);
  return `${routes.tripPlan}?${params.toString()}`;
}

export function travelerCoursePath(courseId: string): string {
  return `/courses/${encodeURIComponent(courseId)}`;
}

export function serverTripPlanPath(origin: PlanOrigin, tripId: string): string {
  return `${routes.tripPlan}?${new URLSearchParams({ from: origin, tripId })}`;
}

export function resumeTripPath(tripId: string | number): string {
  return `${routes.createTrip}?${new URLSearchParams({ tripId: String(tripId), step: "2" })}`;
}

export function importedTripPath(tripId: string): string {
  return `/my-trips/${encodeURIComponent(tripId)}`;
}

export function tripSettingsPath(origin: PlanOrigin, courseId?: string, returnTripId?: number): string {
  const params = new URLSearchParams({ from: origin });
  if (courseId) params.set("course", courseId);
  if (returnTripId !== undefined) params.set("returnTripId", String(returnTripId));
  return `${routes.tripSettings}?${params.toString()}`;
}

export function tripCommunityPath(origin: PlanOrigin, courseId?: string, returnTripId?: number): string {
  const params = new URLSearchParams({ from: origin });
  if (courseId) params.set("course", courseId);
  if (returnTripId !== undefined) params.set("returnTripId", String(returnTripId));
  return `${routes.tripCommunity}?${params.toString()}`;
}

export function tripPlanBackPath(search: string): string {
  const origin = readPlanOrigin(search);
  if (origin === "courses") return routes.courses;
  if (origin === "my-trips") return routes.myTrips;
  return routes.home;
}

export function settingsBackPath(search: string): string {
  const params = new URLSearchParams(search);
  const returnTripId = params.get("returnTripId");
  if (returnTripId && /^\d+$/.test(returnTripId)) {
    return serverTripPlanPath(readPlanOrigin(search), returnTripId);
  }
  return tripPlanPath(readPlanOrigin(search), params.get("course") ?? undefined);
}

export function isDirectTripMode(search: string): boolean {
  const params = new URLSearchParams(search);
  const mode = params.get("mode");
  const mock = params.get("mock");
  return (
    mode === "direct" ||
    mode === "manual" ||
    mock?.startsWith("direct-") === true
  );
}

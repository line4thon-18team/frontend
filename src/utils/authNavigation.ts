import { routes } from "../config/routes.ts";

const publicRoutePatterns = [
  /^\/login\/?$/,
  /^\/my\/account\/withdrawal\/complete\/?$/,
  /^\/auth\/callback\/google\/?$/,
  /^\/invite\/[^/]+\/?$/,
  /^\/my\/account\/policies\/[^/]+\/?$/,
  /^\/terms\/privacy\/?$/,
];

const onboardingRoutePattern = /^\/onboarding\/(terms|profile|preferences|complete)\/?$/;

export function isOnboardingRoute(pathname: string) {
  return onboardingRoutePattern.test(pathname);
}

export function isPublicRoute(pathname: string, allowOnboarding = false) {
  return (
    publicRoutePatterns.some((pattern) => pattern.test(pathname)) ||
    (allowOnboarding && isOnboardingRoute(pathname))
  );
}

export function authRedirectPath(pathname: string, allowOnboarding = false) {
  if (isPublicRoute(pathname, allowOnboarding)) return null;
  return routes.login;
}

export function allowDemoAuthentication(isDevelopment: boolean, apiMode: string) {
  return isDevelopment || apiMode === "mock";
}

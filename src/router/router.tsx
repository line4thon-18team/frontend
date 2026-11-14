import { createBrowserRouter } from "react-router";
import App from "../App";
import Layout from "../components/common/Layout";
import HomePage from "../pages/HomePage";
import { routes } from "../config/routes";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <App />,
    hydrateFallbackElement: <></>,
    children: [
      {
        path: routes.login,
        lazy: async () => ({
          Component: (await import("../pages/OnboardingPage")).default,
        }),
      },
      {
        path: routes.googleAuthCallback,
        lazy: async () => ({
          Component: (await import("../pages/AuthCallbackPage")).default,
        }),
      },
      {
        path: routes.onboardingTerms,
        lazy: async () => ({
          Component: (await import("../pages/OnboardingPage")).default,
        }),
      },
      {
        path: routes.onboardingProfile,
        lazy: async () => ({
          Component: (await import("../pages/OnboardingPage")).default,
        }),
      },
      {
        path: routes.onboardingPreferences,
        lazy: async () => ({
          Component: (await import("../pages/OnboardingPage")).default,
        }),
      },
      {
        path: routes.onboardingComplete,
        lazy: async () => ({
          Component: (await import("../pages/OnboardingPage")).default,
        }),
      },
      {
        path: routes.sharedTrip,
        lazy: async () => ({
          Component: (await import("../pages/SharedTripPage")).default,
        }),
      },
      {
        path: routes.invite,
        lazy: async () => ({
          Component: (await import("../pages/InvitePage")).default,
        }),
      },
      {
        element: <Layout />,
        children: [{ index: true, element: <HomePage /> }],
      },
      {
        path: routes.notifications,
        lazy: async () => ({
          Component: (await import("../pages/NotificationsPage")).default,
        }),
      },
      {
        element: <Layout variant="myTrips" />,
        children: [
          {
            path: routes.myTrips,
            lazy: async () => ({
              Component: (await import("../pages/MyTripsPage")).default,
            }),
          },
        ],
      },
      {
        path: routes.importedTrip,
        lazy: async () => ({
          Component: (await import("../pages/ImportedTripPage")).default,
        }),
      },
      {
        element: <Layout variant="my" />,
        children: [
          {
            path: routes.my,
            lazy: async () => ({
              Component: (await import("../pages/MyPage")).default,
            }),
          },
        ],
      },
      {
        path: routes.savedItems,
        lazy: async () => ({
          Component: (await import("../pages/SavedItemsPage")).default,
        }),
      },
      {
        path: routes.profileEdit,
        lazy: async () => ({
          Component: (await import("../pages/ProfileEditPage")).default,
        }),
      },
      {
        path: routes.notificationSettings,
        lazy: async () => ({
          Component: (await import("../pages/NotificationSettingsPage")).default,
        }),
      },
      {
        path: routes.accountSettings,
        lazy: async () => ({
          Component: (await import("../pages/AccountSettingsPage")).default,
        }),
      },
      {
        path: routes.policyDetail,
        lazy: async () => ({
          Component: (await import("../pages/PolicyDetailPage")).default,
        }),
      },
      {
        path: routes.privacyPolicy,
        lazy: async () => ({
          Component: (await import("../pages/PrivacyPolicyPage")).default,
        }),
      },
      {
        path: routes.googleMapsSettings,
        lazy: async () => ({
          Component: (await import("../pages/GoogleMapsSettingsPage")).default,
        }),
      },
      {
        path: routes.withdrawal,
        lazy: async () => ({
          Component: (await import("../pages/WithdrawalPage")).default,
        }),
      },
      {
        path: routes.withdrawalComplete,
        lazy: async () => ({
          Component: (await import("../pages/WithdrawalPage")).WithdrawalCompletePage,
        }),
      },
      {
        path: routes.notices,
        lazy: async () => ({
          Component: (await import("../pages/SupportPage")).default,
        }),
      },
      {
        path: routes.faq,
        lazy: async () => ({
          Component: (await import("../pages/SupportPage")).default,
        }),
      },
      {
        path: routes.feedback,
        lazy: async () => ({
          Component: (await import("../pages/SupportPage")).default,
        }),
      },
      {
        element: <Layout variant="courses" />,
        children: [
          {
            path: routes.courses,
            lazy: async () => ({
              Component: (await import("../pages/CoursesPage")).default,
            }),
          },
        ],
      },
      {
        path: routes.courseDetail,
        lazy: async () => ({
          Component: (await import("../pages/TravelerCoursePage")).default,
        }),
      },
      {
        path: routes.createTrip,
        lazy: async () => ({
          Component: (await import("../pages/TripCreatePage")).default,
        }),
      },
      {
        path: routes.tripPlan,
        lazy: async () => ({
          Component: (await import("../pages/TripPlanPage")).default,
        }),
      },
      {
        path: routes.tripSettings,
        lazy: async () => ({
          Component: (await import("../pages/CourseSettingsPage")).default,
        }),
      },
      {
        path: routes.tripCommunity,
        lazy: async () => ({
          Component: (await import("../pages/CourseCommunityPage")).default,
        }),
      },
    ],
  },
]);

export default router;

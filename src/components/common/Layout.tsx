import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import * as S from "./Layout.styled";
interface LayoutProps {
  variant?: "home" | "courses" | "trip" | "myTrips" | "my";
  children?: ReactNode;
  step?: number;
  onBack?: () => void;
  hideProgress?: boolean;
  backDisabled?: boolean;
}

function Layout({
  variant = "home",
  children,
  step = 1,
  onBack,
  hideProgress = false,
  backDisabled = false,
}: LayoutProps) {
  const isCourses = variant === "courses";
  const isTrip = variant === "trip";
  const hasBottomNav =
    variant === "home" || variant === "myTrips" || variant === "my";
  return (
    <S.Shell $courses={isCourses || isTrip} $trip={isTrip}>
      <Header
        variant={variant}
        step={step}
        onBack={onBack}
        hideProgress={hideProgress}
        backDisabled={backDisabled}
      />
      <S.Content
        $courses={isCourses}
        $trip={isTrip}
        $myTrips={variant === "myTrips"}
        $my={variant === "my"}
      >
        {children ?? <Outlet />}
      </S.Content>
      {hasBottomNav && <Footer />}
    </S.Shell>
  );
}
export default Layout;

import { useSearchParams } from "react-router";
import pinIcon from "../assets/course-settings/pin.svg";
import CreateTripSheet from "../components/common/CreateTripSheet";
import { mockTripStatus, mockTripSummary, readMockTrips, readTripStorageNotice } from "../data/mocks/mockTripService";
import type { MyTripSummary } from "../types/myTrips";
import { importedTripPath, serverTripPlanPath, tripPlanPath } from "../utils/navigation";
import { apiTripToSummary } from "../utils/serverTrip";
import { useMyTrips } from "../hooks/useMyTrips";
import {
  formatTripDateRange,
  importedTripRegistrationKey,
  parseImportedTripRegistration,
} from "../utils/importedTrip";
import * as S from "./MyTripsPage.styled";

type TripTab = "upcoming" | "past";

function TripCard({ trip, server }: { trip: MyTripSummary; server: boolean }) {
  let dateLabel = trip.dateLabel;
  if (trip.id === "kyoto") {
    try {
      const saved = parseImportedTripRegistration(
        localStorage.getItem(importedTripRegistrationKey("kyoto-walk")),
      );
      if (saved) dateLabel = formatTripDateRange(saved.startDate, saved.endDate);
    } catch {
      // 브라우저 저장소를 사용할 수 없으면 목업의 기본 문구를 사용합니다.
    }
  }

  return (
    <S.TripCard
      to={server ? serverTripPlanPath("my-trips", trip.id) : trip.id === "kyoto" ? importedTripPath(trip.id) : tripPlanPath("my-trips", trip.id)}
      aria-label={`${trip.title} 코스 보기`}
    >
      <img src={trip.coverImage} alt="" />
      <strong>{trip.title}</strong>
      <span>
        <img src={pinIcon} alt="" />
        {trip.city}
      </span>
      <small>
        {dateLabel}
        {trip.countdownLabel && <b>{trip.countdownLabel}</b>}
      </small>
    </S.TripCard>
  );
}

function MyTripsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("tab") === "past" ? "past" : "upcoming") as TripTab;
  const query = searchParams.get("q") ?? "";
  const isSearching = searchParams.has("search");
  const isCreateOpen = searchParams.has("create");
  const toastMessages = new Map([
    ["saved", "여행 일정을 저장했어요"],
    ["course-imported", "교토 2박 3일 일정을 가져왔어요"],
    ["trip-deleted", "여행을 삭제했어요"],
    ["trip-left", "여행에서 나왔어요"],
  ]);
  const toastMessage = toastMessages.get(searchParams.get("toast") ?? "");
  const myTrips = useMyTrips();
  const allTrips = myTrips.enabled
    ? myTrips.trips.map(apiTripToSummary)
    : readMockTrips().filter((trip) => trip.saved).map((trip) => ({
        ...mockTripSummary(trip),
        status: mockTripStatus(trip),
      }));
  const upcomingTrips = allTrips.filter((trip) => trip.status === "upcoming");
  const pastTrips = allTrips.filter((trip) => trip.status === "past");
  const trips = tab === "past" ? pastTrips : upcomingTrips;
  const storageNotice = readTripStorageNotice();
  const filteredTrips = trips.filter((trip) =>
    `${trip.title} ${trip.city}`.toLowerCase().includes(query.toLowerCase()),
  );

  const selectTab = (nextTab: TripTab) => {
    const next = new URLSearchParams();
    if (nextTab === "past") next.set("tab", "past");
    setSearchParams(next);
  };

  const closeOverlay = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("create");
    setSearchParams(next);
  };

  return (
    <S.Page>
      {toastMessage && (
        <S.Toast role="status" aria-live="polite">
          <span>✓</span>
          <strong>{toastMessage}</strong>
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("toast");
              setSearchParams(next, { replace: true });
            }}
            aria-label="알림 닫기"
          >
            ×
          </button>
        </S.Toast>
      )}
      {isSearching && (
        <S.SearchBar>
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              next.set("search", "1");
              if (event.target.value) next.set("q", event.target.value);
              else next.delete("q");
              setSearchParams(next, { replace: true });
            }}
            placeholder="여행 이름이나 도시 검색"
            aria-label="여행 검색어"
          />
          <button
            type="button"
            onClick={() =>
              setSearchParams(tab === "past" ? { tab: "past" } : {})
            }
          >
            취소
          </button>
        </S.SearchBar>
      )}

      <S.Tabs aria-label="마이트립 분류">
        <button
          type="button"
          aria-pressed={tab === "upcoming"}
          onClick={() => selectTab("upcoming")}
        >
          다가오는 여행 <b>{upcomingTrips.length}</b>
        </button>
        <button
          type="button"
          aria-pressed={tab === "past"}
          onClick={() => selectTab("past")}
        >
          지난 여행 <b>{pastTrips.length}</b>
        </button>
      </S.Tabs>

      {!myTrips.enabled && storageNotice && <p role="alert">{storageNotice}</p>}
      {myTrips.pending && <p role="status">내 여행을 불러오고 있어요.</p>}
      {myTrips.error && <p role="alert">{myTrips.error}</p>}
      <S.Grid>
        {filteredTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} server={myTrips.enabled} />
        ))}
      </S.Grid>

      {!myTrips.pending && !myTrips.error && filteredTrips.length === 0 && (
        <S.Empty>
          {query ? "검색 결과가 없어요. 다른 여행 이름을 입력해 보세요."
            : tab === "past" ? "아직 다녀온 여행이 없어요." : "아직 다가오는 여행이 없어요."}
        </S.Empty>
      )}

      {isCreateOpen && <CreateTripSheet onClose={closeOverlay} />}
    </S.Page>
  );
}

export default MyTripsPage;

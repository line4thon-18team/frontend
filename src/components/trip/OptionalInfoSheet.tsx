import { useEffect, useRef, useState } from "react";
import type { Flight, Stay, TripDraft } from "../../types/trip";
import { mockFlights, mockHotels } from "../../data/mocks/tripData";
import {
  addDays,
  changeDates,
  dateLabel,
  dayCount,
  rangeDates,
  toggleId,
  validDate,
  validateStays,
} from "../../utils/trip";
import stayAdd from "../../assets/icons/action-add-stay.svg";
import search from "../../assets/icons/search-default.svg";
import airplane from "../../assets/icons/transport-airplane.svg";
import TripSheet from "../common/TripSheet";
import DateRangePicker from "./DateRangePicker";
import * as S from "./Trip.styled";
import { isServerTripId } from "../../api/adapters";
import { shouldUseMockFallback } from "../../api/client";
import { isApiEnabled } from "../../api/config";
import { searchPlaces } from "../../api/places";
import { saveFlights, saveRental, saveStays, searchFlights } from "../../api/reservations";
import { hasAuthSession } from "../../api/tokenStorage";
import type { PlaceCandidate } from "../../api/types";

interface OptionalInfoSheetProps {
  mode: "flight" | "stay" | "car";
  draft: TripDraft;
  onClose: () => void;
  onSave: (draft: TripDraft) => void;
}
function OptionalInfoSheet({
  mode,
  draft,
  onClose,
  onSave,
}: OptionalInfoSheetProps) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchingFlight, setSearchingFlight] = useState(false);
  const [flightNotFound, setFlightNotFound] = useState(false);
  const [start, setStart] = useState(draft.startDate);
  const [end, setEnd] = useState(draft.endDate);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarSnapshot = useRef({
    start: draft.startDate,
    end: draft.endDate,
  });
  const [flightTab, setFlightTab] = useState<"outbound" | "inbound">(
    "outbound",
  );
  const [flightCode, setFlightCode] = useState(draft.outbound?.code ?? "");
  const [flight, setFlight] = useState<Flight | null>(draft.outbound);
  const [stays, setStays] = useState<Stay[]>(draft.stays);
  const [activeStayId, setActiveStayId] = useState<string | null>(
    draft.stays[0]?.id ?? null,
  );
  const [hotelQuery, setHotelQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingHotel, setPendingHotel] = useState<{
    placeId?: string;
    name: string;
    city: string;
    address: string;
  } | null>(null);
  const [carDays, setCarDays] = useState(draft.rental?.days ?? []);
  const [location, setLocation] = useState(draft.rental?.location ?? "");
  const [rentalPlaceId, setRentalPlaceId] = useState(draft.rental?.placeId);
  const [remotePlaces, setRemotePlaces] = useState<PlaceCandidate[]>();
  const [searchError, setSearchError] = useState("");
  const [staySearch, setStaySearch] = useState<
    { query: string; results: PlaceCandidate[] } | { query: string; error: string }
  >();
  const timelineRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; edge: "start" | "end" } | null>(null);
  const dates = rangeDates(draft.startDate, draft.endDate);
  const nights = dates.slice(0, -1);
  const occupied = new Set(
    stays.flatMap((stay) =>
      rangeDates(stay.startDate, addDays(stay.endDate, -1)),
    ),
  );
  const gaps: { start: number; length: number }[] = [];
  nights.forEach((day, index) => {
    if (occupied.has(day)) return;
    const previous = gaps[gaps.length - 1];
    if (previous && previous.start + previous.length === index)
      previous.length++;
    else gaps.push({ start: index, length: 1 });
  });
  const liveReservations =
    isApiEnabled() && hasAuthSession() && isServerTripId(draft.tripId);
  const demoStaySearch = !isApiEnabled();
  const settledStaySearch = staySearch?.query === hotelQuery.trim() ? staySearch : undefined;
  const activePlaceQuery = mode === "stay" ? hotelQuery : location;
  const hotels = liveReservations
    ? (settledStaySearch && "results" in settledStaySearch ? settledStaySearch.results : [])
        .map((place) => ({ ...place, city: draft.city }))
    : demoStaySearch ? mockHotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(hotelQuery.trim().toLowerCase()) ||
          hotel.address.includes(hotelQuery.trim()),
      ) : [];

  useEffect(() => {
    const query = activePlaceQuery.trim();
    if (!liveReservations || mode === "flight" ||
      (mode === "stay" ? !isSearching || !query : query.length < 2)) {
      return;
    }
    if (mode === "car" && rentalPlaceId) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      if (mode === "car") setSearchError("");
      void searchPlaces(Number(draft.tripId), query, controller.signal).then(
        (results) => {
          if (controller.signal.aborted) return;
          if (mode === "stay") {
            setStaySearch(Array.isArray(results)
              ? { query, results }
              : { query, error: "숙소를 검색하지 못했어요. 다시 시도해 주세요." });
          } else {
            setRemotePlaces(results);
          }
        },
        (reason: unknown) => {
          if (!controller.signal.aborted) {
            if (mode === "stay") {
              setStaySearch({ query, error: "숙소를 검색하지 못했어요. 다시 시도해 주세요." });
              return;
            }
            setRemotePlaces([]);
            setSearchError(reason instanceof Error ? reason.message : "장소를 검색하지 못했어요.");
          }
        },
      );
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [activePlaceQuery, draft.rental?.location, draft.tripId, isSearching, liveReservations, mode, rentalPlaceId]);

  async function findFlight() {
    setFlightNotFound(false);
    if (!validDate(start) || !validDate(end) || end < start) {
      setError("여행 날짜를 다시 선택해 주세요.");
      return;
    }
    const code = flightCode.trim().toUpperCase().replaceAll(" ", "");
    setError("");
    if (!/^[A-Z0-9]{2,3}\d{1,4}$/.test(code)) {
      setError("편명을 확인해 주세요.");
      return;
    }
    const date = flightTab === "outbound" ? start : end;
    if (isApiEnabled() && hasAuthSession()) {
      setSearchingFlight(true);
      try {
        const results = await searchFlights(code, date);
        if (!Array.isArray(results)) {
          throw new Error("항공편 조회 응답을 확인하지 못했어요. 다시 시도해 주세요.");
        }
        if (results.length === 0) {
          setFlightNotFound(true);
          return;
        }
        const result = results[0];
        setFlight({
          code: result.number,
          airline: result.airline ?? result.number,
          date,
          departure: result.departure.time.slice(11, 16),
          arrival: result.arrival.time.slice(11, 16),
          from: result.departure.airport,
          to: result.arrival.airport,
          apiFlight: result,
        });
        return;
      } catch {
        setError("항공편을 조회하지 못했어요. 다시 시도해 주세요.");
      } finally {
        setSearchingFlight(false);
      }
      return;
    }
    const match = mockFlights.find(
      (item) =>
        item.code === code &&
        (flightTab === "outbound"
          ? item.from.includes("인천")
          : item.to.includes("인천")),
    );
    if (!match || !["오사카", "교토"].includes(draft.city)) {
      setFlightNotFound(true);
      return;
    }
    setFlight({ ...match, date: flightTab === "outbound" ? start : end });
  }
  function addHotel(
    hotel: { placeId?: string; name: string; city: string; address: string },
    approved = false,
  ) {
    if (hotel.city !== draft.city && !approved) {
      setPendingHotel(hotel);
      return;
    }
    if (!nights.length) {
      setError("당일치기 여행은 숙박할 밤이 없어요.");
      return;
    }
    const previous = stays.find((item) => item.id === editingId);
    const free = nights.find(
      (day) =>
        !stays.some(
          (item) =>
            item.id !== editingId &&
            day >= item.startDate &&
            day < item.endDate,
        ),
    );
    if (!previous && !free) {
      setError("등록된 숙소와 날짜가 겹쳐요. 블록을 눌러 숙소를 바꿔주세요.");
      return;
    }
    const stay: Stay = {
      id: previous?.id ?? crypto.randomUUID(),
      placeId: hotel.placeId,
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      startDate: previous?.startDate ?? free!,
      endDate: previous?.endDate ?? addDays(free!, 1),
    };
    const next = [...stays.filter((item) => item.id !== editingId), stay];
    const message = validateStays(next, draft.startDate, draft.endDate);
    if (message) {
      setError(message);
      return;
    }
    setStays(next);
    setActiveStayId((current) => current ?? stay.id);
    setIsSearching(false);
    setHotelQuery("");
    setEditingId(null);
    setPendingHotel(null);
    setError("");
  }
  function resizeStay(id: string, edge: "start" | "end", index: number) {
    const stay = stays.find((item) => item.id === id);
    if (!stay) return;
    const currentStart = dayCount(draft.startDate, stay.startDate) - 1;
    const currentEnd = dayCount(draft.startDate, stay.endDate) - 1;
    const nextIndex =
      edge === "start"
        ? Math.max(0, Math.min(index, currentEnd - 1))
        : Math.max(currentStart + 1, Math.min(index, nights.length));
    const updated = {
      ...stay,
      [edge === "start" ? "startDate" : "endDate"]: addDays(
        draft.startDate,
        nextIndex,
      ),
    };
    const next = stays.map((item) => (item.id === id ? updated : item));
    if (!validateStays(next, draft.startDate, draft.endDate)) {
      setStays(next);
      setError("");
    }
  }
  function renderStayHandle(stay: Stay, edge: "start" | "end") {
    const value =
      dayCount(
        draft.startDate,
        edge === "start" ? stay.startDate : stay.endDate,
      ) - 1;
    return (
      <S.ResizeHandle
        $edge={edge}
        $active={activeStayId === stay.id}
        role="slider"
        tabIndex={0}
        aria-label={`${stay.name} ${edge === "start" ? "체크인" : "체크아웃"} 날짜`}
        aria-valuemin={0}
        aria-valuemax={nights.length}
        aria-valuenow={value}
        aria-valuetext={edge === "start" ? stay.startDate : stay.endDate}
        onFocus={() => setActiveStayId(stay.id)}
        onPointerDown={(event) => {
          setActiveStayId(stay.id);
          drag.current = { id: stay.id, edge };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current || !timelineRef.current) return;
          const rect = timelineRef.current.getBoundingClientRect();
          resizeStay(
            drag.current.id,
            drag.current.edge,
            Math.round(
              ((event.clientX - rect.left) / rect.width) * nights.length,
            ),
          );
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            resizeStay(
              stay.id,
              edge,
              value + (event.key === "ArrowRight" ? 1 : -1),
            );
          }
        }}
      />
    );
  }
  async function save() {
    setError("");
    if (mode === "flight") {
      if (!flight) return;
      const updated = changeDates(draft, start, end);
      const next = {
        ...updated,
        [flightTab]: {
          ...flight,
          date: flightTab === "outbound" ? start : end,
        },
      };
      if (
        next.outbound &&
        next.inbound &&
        next.outbound.date === next.inbound.date &&
        next.inbound.departure <= next.outbound.arrival
      ) {
        setError(
          "오는 편 출발 시간이 도착 시간보다 빨라요. 항공편과 날짜를 확인해 주세요.",
        );
        return;
      }
      if (
        isApiEnabled() &&
        hasAuthSession() &&
        isServerTripId(draft.tripId) &&
        flight.apiFlight
      ) {
        setSaving(true);
        try {
          await saveFlights(
            Number(draft.tripId),
            next.outbound?.apiFlight ?? null,
            next.inbound?.apiFlight ?? null,
          );
        } catch (reason) {
          if (!shouldUseMockFallback(reason)) {
            setError(
              reason instanceof Error
                ? reason.message
                : "항공편을 저장하지 못했어요. 다시 시도해 주세요.",
            );
            return;
          }
        } finally {
          setSaving(false);
        }
      }
      onSave(next);
    } else if (mode === "stay") {
      const message = validateStays(stays, draft.startDate, draft.endDate);
      if (message) {
        setError(message);
        return;
      }
      if (liveReservations) {
        if (stays.some((stay) => !stay.placeId)) {
          setError("서버 검색 결과에서 숙소를 선택해 주세요.");
          return;
        }
        setSaving(true);
        try {
          const response = await saveStays(
            Number(draft.tripId),
            stays.map((stay) => ({
              placeId: stay.placeId!,
              checkIn: stay.startDate,
              checkOut: stay.endDate,
            })),
          );
          onSave({
            ...draft,
            stays: response.stays.map((stay) => ({
              id: `stay-${stay.placeId}-${stay.checkIn}`,
              placeId: stay.placeId,
              name: stay.name,
              address: stay.address,
              city: draft.city,
              startDate: stay.checkIn,
              endDate: stay.checkOut,
            })),
          });
          return;
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "숙소를 저장하지 못했어요.");
          return;
        } finally {
          setSaving(false);
        }
      }
      onSave({ ...draft, stays });
    } else if (carDays.length && location.trim()) {
      if (liveReservations) {
        if (!rentalPlaceId) {
          setError("서버 검색 결과에서 픽업·반납 장소를 선택해 주세요.");
          return;
        }
        setSaving(true);
        try {
          const response = await saveRental(
            Number(draft.tripId),
            [...carDays].sort(),
            rentalPlaceId,
          );
          onSave({
            ...draft,
            rental: response.rental
              ? {
                  days: response.rental.dates,
                  location: response.rental.name,
                  placeId: response.rental.placeId,
                }
              : null,
          });
          return;
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "렌터카 정보를 저장하지 못했어요.");
          return;
        } finally {
          setSaving(false);
        }
      }
      onSave({
        ...draft,
        rental: {
          days: [...carDays].sort(),
          location: location.trim(),
          placeId: rentalPlaceId,
        },
      });
    }
  }
  const title =
    mode === "flight"
      ? "항공권 등록"
      : mode === "stay"
        ? "숙소 등록"
        : "렌터카 등록";
  if (showCalendar)
    return (
      <TripSheet
        title="언제 떠나세요?"
        onClose={() => {
          setStart(calendarSnapshot.current.start);
          setEnd(calendarSnapshot.current.end);
          setShowCalendar(false);
        }}
        footer={
          <S.Primary
            type="button"
            disabled={!validDate(start) || !validDate(end) || end < start}
            onClick={() => {
              setFlight(null);
              setError("");
              setFlightNotFound(false);
              setShowCalendar(false);
            }}
          >
            선택 완료
          </S.Primary>
        }
      >
        <DateRangePicker
          start={start}
          end={end}
          onChange={(a, b) => {
            setStart(a);
            setEnd(b);
          }}
        />
      </TripSheet>
    );
  return (
    <TripSheet
      title={title}
      contentGap={12}
      minHeight={mode === "flight" ? 367 : mode === "stay" ? 393 : 449}
      onClose={onClose}
      footer={
        <>
          <S.Primary
            type="button"
            onClick={() => void (mode === "flight" && !flight ? findFlight() : save())}
            disabled={
              saving || searchingFlight ||
              (mode === "flight"
                ? !flight && !flightCode.trim()
                : mode === "stay"
                  ? !stays.length
                  : !carDays.length || !location.trim())
            }
          >
            {searchingFlight
              ? "항공편을 찾고 있어요"
              : saving
              ? "처리하고 있어요"
              : mode === "flight"
              ? flight
                ? `${flightTab === "outbound" ? "가는" : "오는"} 편 등록하기`
                : "항공편 찾기"
              : mode === "stay"
                ? "완료"
                : "렌터카 등록하기"}
          </S.Primary>
        </>
      }
    >
      {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
      {mode === "flight" && (
        <>
          <S.Tabs>
            {(["outbound", "inbound"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                aria-pressed={flightTab === tab}
                disabled={searchingFlight || saving}
                onClick={() => {
                  setFlightTab(tab);
                  setFlightCode(draft[tab]?.code ?? "");
                  setFlight(draft[tab]);
                  setError("");
                  setFlightNotFound(false);
                }}
              >
                {tab === "outbound" ? "가는 편" : "오는 편"}
              </button>
            ))}
          </S.Tabs>
          <S.FlightField $found={Boolean(flight)}>
            <img src={airplane} alt="" />
            <label>
              <S.Help>편명</S.Help>
              <S.Input
                aria-label="편명"
                placeholder="예) KE723, 7C1301"
                maxLength={8}
                value={flightCode}
                readOnly={searchingFlight || saving}
                onChange={(event) => {
                  setFlightCode(event.target.value.toUpperCase());
                  setFlight(null);
                  setError("");
                  setFlightNotFound(false);
                }}
              />
            </label>
            <S.Chip
              type="button"
              disabled={searchingFlight || saving}
              onClick={() => {
                calendarSnapshot.current = { start, end };
                setShowCalendar(true);
              }}
            >
              {dateLabel(flightTab === "outbound" ? start : end)}
            </S.Chip>
          </S.FlightField>
          {flight ? (
            <S.FlightResult>
              <strong>{flight.airline}</strong>
              <S.FlightTimes>
                <div>
                  <small>{flight.from.split(" ").at(-1)}</small>
                  <strong>{flight.departure}</strong>
                </div>
                <S.FlightLine />
                <div>
                  <small>{flight.to.split(" ").at(-1)}</small>
                  <strong>{flight.arrival}</strong>
                </div>
              </S.FlightTimes>
            </S.FlightResult>
          ) : !error && (
            <S.Help role="status">
              {searchingFlight
                ? "항공편을 조회하고 있어요."
                : flightNotFound
                  ? "조건에 맞는 항공편이 없어요. 편명과 날짜를 확인해 주세요."
                  : "편명만 입력하면 시간을 자동으로 찾아요"}
            </S.Help>
          )}
        </>
      )}
      {mode === "stay" && (
        <>
          <S.Timeline>
            {nights.length > 0 ? (
              <>
                <S.NightCanvas $nights={nights.length}>
                  <S.NightHeader $columns={nights.length}>
                    {nights.map((day) => (
                      <span key={day}>
                        {dateLabel(day).split(" ")[1]} 밤
                        <strong>{dateLabel(day).split(" ")[0]}</strong>
                      </span>
                    ))}
                  </S.NightHeader>
                  <S.StayRow ref={timelineRef}>
                    {stays.map((stay) => {
                      const startIndex =
                        dayCount(draft.startDate, stay.startDate) - 1;
                      const length = dayCount(stay.startDate, stay.endDate) - 1;
                      return (
                        <S.StayBlock
                          key={stay.id}
                          $start={startIndex}
                          $span={length}
                          $nights={nights.length}
                          $active={activeStayId === stay.id}
                        >
                          {renderStayHandle(stay, "start")}
                          <button
                            type="button"
                            title={stay.name}
                            onClick={() => {
                              setActiveStayId(stay.id);
                              setEditingId(stay.id);
                              setHotelQuery(stay.name);
                              setStaySearch(undefined);
                              setIsSearching(true);
                            }}
                          >
                            <strong>{stay.name}</strong>
                            <small>{length}박</small>
                          </button>
                          {renderStayHandle(stay, "end")}
                        </S.StayBlock>
                      );
                    })}
                    {gaps.map((gap) => (
                      <S.AddStay
                        key={gap.start}
                        $start={gap.start}
                        $span={gap.length}
                        $nights={nights.length}
                        type="button"
                        title={stays.length ? "숙소 추가" : "숙소 검색"}
                        onClick={() => {
                          setEditingId(null);
                          setHotelQuery("");
                          setStaySearch(undefined);
                          setIsSearching(true);
                        }}
                      >
                        <img src={stayAdd} alt="" />
                        <span>{stays.length ? "숙소 추가" : "숙소 검색"}</span>
                      </S.AddStay>
                    ))}
                  </S.StayRow>
                </S.NightCanvas>
              </>
            ) : (
              <S.Help>당일치기 여행은 숙박할 밤이 없어요.</S.Help>
            )}
          </S.Timeline>
          <S.Help>
            {stays.length
              ? "블록 끝을 끌어 묵는 밤을 바꿔요"
              : "숙소가 바뀌면 블록 끝을 끌어 날짜를 나눌 수 있어요"}
          </S.Help>
          {isSearching && (
            <>
              <S.Search>
                <img src={search} alt="" />
                <input
                  aria-label="숙소 검색"
                  placeholder="숙소 검색"
                  value={hotelQuery}
                  onChange={(event) => {
                    setHotelQuery(event.target.value);
                    setPendingHotel(null);
                    if (event.target.value.trim() !== hotelQuery.trim()) setStaySearch(undefined);
                  }}
                />
              </S.Search>
              <S.Results>
                {hotels.map((hotel) => (
                  <button
                    type="button"
                    key={("placeId" in hotel && hotel.placeId) || ("id" in hotel && hotel.id) || hotel.name}
                    onClick={() => addHotel(hotel)}
                  >
                    <strong>{hotel.name}</strong>
                    <small>{hotel.address}</small>
                  </button>
                ))}
              </S.Results>
              {!liveReservations && !demoStaySearch && (
                <S.Help role="status">저장된 여행에서 숙소를 검색할 수 있어요.</S.Help>
              )}
              {liveReservations && hotelQuery.trim() && !settledStaySearch && (
                <S.Help role="status">숙소를 검색하고 있어요.</S.Help>
              )}
              {settledStaySearch && "error" in settledStaySearch && (
                <S.ErrorText role="alert">{settledStaySearch.error}</S.ErrorText>
              )}
              {hotelQuery.trim() && !hotels.length &&
                (demoStaySearch || (settledStaySearch && "results" in settledStaySearch)) && (
                <>
                  <S.Help role="status">
                    {liveReservations
                      ? "숙소 검색 결과가 없어요. 다른 이름으로 검색해 주세요."
                      : "숙소 검색 결과가 없어요. 주소를 직접 입력해 주세요."}
                  </S.Help>
                  {!liveReservations && <S.Input
                    aria-label="숙소 주소 직접 입력"
                    placeholder="숙소 주소"
                    value={hotelQuery}
                    onChange={(event) => setHotelQuery(event.target.value)}
                  />}
                  {!liveReservations && <S.Chip
                    type="button"
                    onClick={() =>
                      addHotel({
                        name: hotelQuery.trim(),
                        address: hotelQuery.trim(),
                        city: draft.city,
                      })
                    }
                  >
                    이 주소로 등록
                  </S.Chip>}
                </>
              )}
              {pendingHotel && (
                <>
                  <S.ErrorText role="alert">
                    숙소가 {pendingHotel.city}에 있어요. 이 숙소로 등록할까요?
                  </S.ErrorText>
                  <S.Chip
                    type="button"
                    onClick={() => addHotel(pendingHotel, true)}
                  >
                    이 숙소로 등록
                  </S.Chip>
                </>
              )}
            </>
          )}
        </>
      )}
      {mode === "car" && (
        <>
          <S.PlaceControls>
            <strong>렌터카 쓰는 날</strong>
            <span>
              {carDays.length
                ? `${carDays.length}일 선택`
                : "여러 날 고를 수 있어요"}
            </span>
          </S.PlaceControls>
          <S.RentalDays>
            {dates.map((day) => (
              <button
                key={day}
                type="button"
                aria-label={`${day} 렌터카`}
                aria-pressed={carDays.includes(day)}
                onClick={() => setCarDays((current) => toggleId(current, day))}
              >
                <span>{dateLabel(day).split(" ")[1]}</span>
                <strong>{dateLabel(day).split(" ")[0]}</strong>
              </button>
            ))}
          </S.RentalDays>
          <strong>픽업, 반납 장소</strong>
          <S.Search $filled={Boolean(location.trim())}>
            <img src={search} alt="" />
            <input
              aria-label="픽업, 반납 장소"
              placeholder="공항, 역, 영업소 검색"
              maxLength={200}
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setRentalPlaceId(undefined);
                setRemotePlaces(undefined);
              }}
            />
          </S.Search>
          {liveReservations && location.trim().length >= 2 && (
            <S.Results>
              {(remotePlaces ?? []).map((place) => (
                <button
                  type="button"
                  key={place.placeId}
                  onClick={() => {
                    setLocation(place.name);
                    setRentalPlaceId(place.placeId);
                    setRemotePlaces(undefined);
                    setSearchError("");
                  }}
                >
                  <strong>{place.name}</strong>
                  <small>{place.address}</small>
                </button>
              ))}
            </S.Results>
          )}
          {searchError && <S.ErrorText role="alert">{searchError}</S.ErrorText>}
          <S.Help>
            {carDays.length
              ? "렌터카 쓰는 날은 근교까지 넓게 짜요"
              : "고른 날만 차로 이동하는 코스로 짜요"}
          </S.Help>
        </>
      )}
    </TripSheet>
  );
}
export default OptionalInfoSheet;

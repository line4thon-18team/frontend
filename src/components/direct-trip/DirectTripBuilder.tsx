import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import heroPhoto from "../../assets/course-completion/hero-photo.png";
import emptyCharacter from "../../assets/images/character-empty-places.webp";
import googleMapsLogo from "../../assets/images/brand-google-maps.webp";
import routeMap from "../../assets/course-completion/route-map.png";
import searchIcon from "../../assets/course-completion/search.svg";
import settingsIcon from "../../assets/course-completion/settings.svg";
import backIcon from "../../assets/icons/nav-back.svg";
import closeIcon from "../../assets/icons/action-close.svg";
import airplaneIcon from "../../assets/icons/transport-airplane.svg";
import bedIcon from "../../assets/icons/transport-bed.svg";
import carIcon from "../../assets/icons/transport-car.svg";
import { routes } from "../../config/routes";
import {
  directTripDays,
  directTripPlaces,
  directTripRecentSearches,
} from "../../data/mocks/directTripData";
import type {
  DirectTripPlace,
  DirectTripSearchTab,
  DirectTripStage,
} from "../../types/directTrip";
import {
  readGoogleMapsSettings,
  saveGoogleMapsSettings,
} from "../../utils/mySettings";
import { readMockScenario } from "../../utils/mockScenario";
import * as S from "./DirectTripBuilder.styled";

const emptyDayPlaces: Record<number, string[]> = {
  1: [],
  2: [],
  3: [],
  4: [],
};

function BackIcon() {
  return <img src={backIcon} alt="" />;
}

function DirectTripBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const mockScenario = readMockScenario(location.search);
  const [stage, setStage] = useState<DirectTripStage>(() => {
    if (
      mockScenario === "direct-search-empty" ||
      mockScenario === "direct-google-unlinked"
    ) {
      return "search";
    }
    if (mockScenario === "direct-exit-confirm") return "itinerary";
    return "info";
  });
  const [selectedDay, setSelectedDay] = useState(1);
  const [searchTab, setSearchTab] = useState<DirectTripSearchTab>(() =>
    mockScenario === "direct-google-unlinked" ? "google" : "recommend",
  );
  const [query, setQuery] = useState(() =>
    mockScenario === "direct-search-empty" ? "쿠로몬 야타이" : "",
  );
  const [googleLinked, setGoogleLinked] = useState(() => {
    if (mockScenario === "direct-google-unlinked") return false;
    try {
      return readGoogleMapsSettings(window.localStorage).linked;
    } catch {
      return true;
    }
  });
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [dayPlaces, setDayPlaces] = useState<Record<number, string[]>>(() =>
    mockScenario === "direct-exit-confirm"
      ? { ...emptyDayPlaces, 1: ["kuromon"] }
      : emptyDayPlaces,
  );
  const [showExitConfirm, setShowExitConfirm] = useState(
    mockScenario === "direct-exit-confirm",
  );

  const placesForDay = useMemo(
    () =>
      dayPlaces[selectedDay]
        .map((id) => directTripPlaces.find((place) => place.id === id))
        .filter((place): place is DirectTripPlace => Boolean(place)),
    [dayPlaces, selectedDay],
  );

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return directTripPlaces.filter((place) => {
      const sourceMatches =
        searchTab === "recommend" || place.source === "google";
      const queryMatches =
        !normalizedQuery ||
        `${place.name} ${place.category} ${place.detail}`
          .toLowerCase()
          .includes(normalizedQuery);
      return sourceMatches && queryMatches;
    });
  }, [query, searchTab]);

  const placeCount = Object.values(dayPlaces).reduce(
    (total, places) => total + places.length,
    0,
  );
  const hasAnyPlace = placeCount > 0;

  const goBack = () => {
    if (stage === "search") {
      setSelectedPlaceIds([]);
      setStage("itinerary");
      return;
    }
    if (stage === "itinerary") {
      if (hasAnyPlace) setShowExitConfirm(true);
      else setStage("info");
      return;
    }
    navigate(routes.home);
  };

  const togglePlace = (id: string) => {
    setSelectedPlaceIds((current) =>
      current.includes(id)
        ? current.filter((placeId) => placeId !== id)
        : [...current, id],
    );
  };

  const addSelectedPlaces = () => {
    setDayPlaces((current) => ({
      ...current,
      [selectedDay]: Array.from(
        new Set([...current[selectedDay], ...selectedPlaceIds]),
      ),
    }));
    setSelectedPlaceIds([]);
    setQuery("");
    setStage("itinerary");
  };

  const movePlace = (placeId: string, nextDay: number) => {
    setDayPlaces((current) => {
      const next: Record<number, string[]> = {};
      Object.entries(current).forEach(([day, ids]) => {
        next[Number(day)] = ids.filter((id) => id !== placeId);
      });
      next[nextDay] = [...next[nextDay], placeId];
      return next;
    });
  };

  const removePlace = (placeId: string) => {
    setDayPlaces((current) => ({
      ...current,
      [selectedDay]: current[selectedDay].filter((id) => id !== placeId),
    }));
  };

  const connectGoogleMaps = () => {
    setGoogleLinked(true);
    try {
      const current = readGoogleMapsSettings(window.localStorage);
      saveGoogleMapsSettings(window.localStorage, {
        ...current,
        linked: true,
      });
    } catch {
      // 저장소를 사용할 수 없는 환경에서도 현재 데모 흐름은 계속 진행합니다.
    }
  };

  const renderInfo = () => (
    <S.PlainScreen>
      <S.PlainHeader>
        <S.BackButton type="button" onClick={goBack} aria-label="뒤로 가기">
          <BackIcon />
        </S.BackButton>
        <h1>직접 일정 만들기</h1>
      </S.PlainHeader>
      <S.InfoScroll>
        <S.InfoIntro>
          <p>이번 여행은</p>
          <h2>
            <strong>오사카</strong>로
            <br />
            <strong>5월 18일부터 3박 4일</strong>
            <br />
            <strong>친구 3명</strong>과 떠날 거예요
          </h2>
          <button type="button" aria-label="여행 정보 수정">
            수정
          </button>
        </S.InfoIntro>

        <S.InfoSection>
          <h3>예약 정보도 함께 관리해 보세요</h3>
          <p>지금 입력하지 않아도 나중에 일정에서 추가할 수 있어요.</p>
          <S.OptionalGrid>
            <button type="button">
              <span><img src={airplaneIcon} alt="" /></span>
              <strong>항공권</strong>
              <small>항공편 추가</small>
            </button>
            <button type="button">
              <span><img src={bedIcon} alt="" /></span>
              <strong>숙소</strong>
              <small>숙소 추가</small>
            </button>
            <button type="button">
              <span><img src={carIcon} alt="" /></span>
              <strong>렌터카</strong>
              <small>차량 추가</small>
            </button>
          </S.OptionalGrid>
        </S.InfoSection>
      </S.InfoScroll>
      <S.BottomAction>
        <button type="button" onClick={() => setStage("itinerary")}>
          일정 만들기
        </button>
      </S.BottomAction>
    </S.PlainScreen>
  );

  const renderItinerary = () => (
    <S.PlanScreen>
      <S.Hero>
        <img src={heroPhoto} alt="오사카 도톤보리" />
        <S.HeroScrim />
        <S.HeroHeader>
          <S.BackButton type="button" onClick={goBack} aria-label="뒤로 가기">
            <BackIcon />
          </S.BackButton>
          <div>
            <small>내 일정</small>
            <h1>오사카 3박 4일</h1>
            <p>5.18 월 – 5.21 목</p>
          </div>
          <button type="button" aria-label="일정 설정">
            <img src={settingsIcon} alt="" />
          </button>
        </S.HeroHeader>
      </S.Hero>

      <S.PlanScroll>
        <S.TripSummary>
          <div>
            <span>여행지</span>
            <strong>오사카</strong>
          </div>
          <i />
          <div>
            <span>기간</span>
            <strong>3박 4일</strong>
          </div>
          <i />
          <div>
            <span>동행</span>
            <strong>친구 3명</strong>
          </div>
        </S.TripSummary>

        <S.DayTabs aria-label="일정 일자">
          {directTripDays.map((day) => (
            <button
              type="button"
              key={day.day}
              aria-pressed={selectedDay === day.day}
              onClick={() => setSelectedDay(day.day)}
            >
              <strong>{day.day}일차</strong>
              <span>
                {day.date} {day.weekday}
              </span>
              {dayPlaces[day.day].length > 0 && <i />}
            </button>
          ))}
        </S.DayTabs>

        {placesForDay.length === 0 ? (
          <S.EmptyPlan>
            <img src={emptyCharacter} alt="" />
            <h2>아직 담긴 장소가 없어요</h2>
            <p>
              가고 싶은 장소를 검색하고
              <br />
              {selectedDay}일차 일정을 채워 보세요.
            </p>
            <button type="button" onClick={() => setStage("search")}>
              <img src={searchIcon} alt="" />
              장소 검색해서 담기
            </button>
          </S.EmptyPlan>
        ) : (
          <S.FilledPlan>
            <S.RouteMap>
              <img src={routeMap} alt="선택한 장소 이동 경로 지도" />
              {placesForDay.map((place, index) => (
                <span key={place.id} style={{ left: `${25 + index * 24}%`, top: `${28 + (index % 2) * 26}%` }}>
                  {index + 1}
                </span>
              ))}
            </S.RouteMap>
            <S.ScheduleHeader>
              <div>
                <strong>{selectedDay}일차 일정</strong>
                <span>{placesForDay.length}곳</span>
              </div>
              <button type="button" onClick={() => setStage("search")}>
                + 장소 추가
              </button>
            </S.ScheduleHeader>
            <S.Timeline>
              {placesForDay.map((place, index) => (
                <li key={place.id}>
                  <S.TimelineNumber>{index + 1}</S.TimelineNumber>
                  <S.TimelineCard>
                    <img src={place.image} alt="" />
                    <div>
                      <small>{place.category}</small>
                      <strong>{place.name}</strong>
                      <span>{place.detail}</span>
                      <label>
                        <span className="sr-only">{place.name} 이동 일자</span>
                        <select
                          value={selectedDay}
                          onChange={(event) =>
                            movePlace(place.id, Number(event.target.value))
                          }
                        >
                          {directTripDays.map((day) => (
                            <option key={day.day} value={day.day}>
                              {day.day}일차로 이동
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePlace(place.id)}
                      aria-label={`${place.name} 삭제`}
                    >
                      <img src={closeIcon} alt="" />
                    </button>
                  </S.TimelineCard>
                  {index < placesForDay.length - 1 && (
                    <S.TravelRow>↳ {place.travelTime ?? "도보 8분"}</S.TravelRow>
                  )}
                </li>
              ))}
            </S.Timeline>
          </S.FilledPlan>
        )}
      </S.PlanScroll>

      <S.BottomAction $floating>
        <button
          type="button"
          disabled={!hasAnyPlace}
          onClick={() => navigate(`${routes.myTrips}?toast=saved`)}
        >
          저장하기
        </button>
      </S.BottomAction>
    </S.PlanScreen>
  );

  const renderSearch = () => {
    const showGoogleConnect = searchTab === "google" && !googleLinked;
    return (
      <S.SearchScreen>
        <S.SearchHeader>
          <S.BackButton type="button" onClick={goBack} aria-label="뒤로 가기">
            <BackIcon />
          </S.BackButton>
          <label data-active={Boolean(query)}>
            <img src={searchIcon} alt="" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="장소 이름을 검색해 보세요"
              aria-label="장소 검색어"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="검색어 지우기">
                <img src={closeIcon} alt="" />
              </button>
            )}
          </label>
        </S.SearchHeader>

        <S.SearchContext>
          <span>{selectedDay}일차 {directTripDays[selectedDay - 1].date}</span>
          <strong>에 담아요</strong>
        </S.SearchContext>

        <S.SearchTabs>
          <button
            type="button"
            aria-pressed={searchTab === "recommend"}
            onClick={() => setSearchTab("recommend")}
          >
            추천
          </button>
          <button
            type="button"
            aria-pressed={searchTab === "google"}
            onClick={() => setSearchTab("google")}
          >
            <img src={googleMapsLogo} alt="" />
            Google Maps 저장 {googleLinked && <b>52</b>}
          </button>
        </S.SearchTabs>

        <S.SearchScroll>
          {showGoogleConnect ? (
            <S.GoogleConnect>
              <S.StateIcon>
                <img src={googleMapsLogo} alt="Google Maps" />
              </S.StateIcon>
              <h2>Google Maps 장소를 불러올까요?</h2>
              <p>저장해 둔 맛집, 카페를 바로 일정에 담을 수 있어요</p>
              <button type="button" onClick={connectGoogleMaps}>
                <img src={googleMapsLogo} alt="" />
                Google Maps 연결하기
              </button>
            </S.GoogleConnect>
          ) : filteredPlaces.length === 0 ? (
            <S.NoResults>
              <S.StateIcon>
                <img src={searchIcon} alt="" />
              </S.StateIcon>
              <h2>검색 결과가 없어요</h2>
              <p>철자를 확인하거나 다른 이름으로 검색해 보세요</p>
            </S.NoResults>
          ) : (
            <>
              {!query && searchTab === "recommend" && (
                <S.RecentSearches>
                  <h2>최근 검색</h2>
                  <div>
                    {directTripRecentSearches.map((keyword) => (
                      <button type="button" key={keyword} onClick={() => setQuery(keyword)}>
                        {keyword}
                      </button>
                    ))}
                  </div>
                </S.RecentSearches>
              )}
              <S.ResultHeading>
                {query ? `‘${query}’ 검색 결과` : searchTab === "google" ? "내 저장 장소" : "오사카 추천 장소"}
              </S.ResultHeading>
              <S.PlaceList>
                {filteredPlaces.map((place) => {
                  const selected = selectedPlaceIds.includes(place.id);
                  const alreadyAdded = dayPlaces[selectedDay].includes(place.id);
                  return (
                    <li key={place.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        disabled={alreadyAdded}
                        onClick={() => togglePlace(place.id)}
                      >
                        <img src={place.image} alt="" />
                        <span>
                          <small>{place.category}</small>
                          <strong>{place.name}</strong>
                          <em>{place.detail}</em>
                        </span>
                        <i aria-hidden="true">{alreadyAdded ? "완료" : selected ? "✓" : ""}</i>
                      </button>
                    </li>
                  );
                })}
              </S.PlaceList>
            </>
          )}
        </S.SearchScroll>

        <S.BottomAction $floating>
          <button
            type="button"
            disabled={
              showGoogleConnect ||
              filteredPlaces.length === 0 ||
              selectedPlaceIds.length === 0
            }
            onClick={addSelectedPlaces}
          >
            {selectedPlaceIds.length > 0
              ? `${selectedPlaceIds.length}곳을 ${selectedDay}일차에 담기`
              : "담을 장소를 골라주세요"}
          </button>
        </S.BottomAction>
      </S.SearchScreen>
    );
  };

  return (
    <S.Shell>
      {stage === "info" && renderInfo()}
      {stage === "itinerary" && renderItinerary()}
      {stage === "search" && renderSearch()}
      {showExitConfirm && (
        <S.ConfirmOverlay role="presentation" onMouseDown={() => setShowExitConfirm(false)}>
          <S.ConfirmDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="direct-trip-exit-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="direct-trip-exit-title">저장하지 않고 나갈까요?</h2>
            <p>담은 장소 {placeCount}곳이 사라져요</p>
            <div>
              <button type="button" onClick={() => navigate(routes.home)}>
                나가기
              </button>
              <button type="button" onClick={() => setShowExitConfirm(false)}>
                계속 만들기
              </button>
            </div>
          </S.ConfirmDialog>
        </S.ConfirmOverlay>
      )}
    </S.Shell>
  );
}

export default DirectTripBuilder;


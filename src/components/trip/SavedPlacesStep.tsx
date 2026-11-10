import { useEffect, useRef, useState } from "react";
import type {
  PlaceCategory,
  PlaceCourse,
  TripDraft,
  TripPlace,
} from "../../types/trip";
import {
  mockTripCatalog,
  mockCourseStopDetails,
  mockSavedPlaceCounts,
} from "../../data/mocks/tripData";
import { importMockPlaces } from "../../data/mocks/tripService";
import { mergePlaces, placesError, toggleId } from "../../utils/trip";
import TripSheet from "../common/TripSheet";
import maps from "../../assets/images/brand-google-maps.webp";
import character from "../../assets/images/character-purple.webp";
import emptyImage from "../../assets/images/character-empty-places.webp";
import routeImage from "../../assets/images/map-course-preview.png";
import emptyGlow from "../../assets/icons/effect-empty-places-glow.svg";
import purple from "../../assets/icons/effect-connect-purple.svg";
import cyan from "../../assets/icons/effect-connect-cyan.svg";
import foodSmall from "../../assets/icons/category-food-small.svg";
import cafeSmall from "../../assets/icons/category-cafe-small.svg";
import cameraSmall from "../../assets/icons/category-sightseeing-small.svg";
import food from "../../assets/icons/category-food.svg";
import cafe from "../../assets/icons/category-cafe.svg";
import camera from "../../assets/icons/category-sightseeing.svg";
import shopping from "../../assets/icons/category-shopping.svg";
import searchIcon from "../../assets/icons/search-default.svg";
import loadingDots from "../../assets/icons/status-loading-dots.svg";
import chevronIcon from "../../assets/icons/nav-chevron-right.svg";
import * as S from "./Trip.styled";
import * as P from "./SavedPlacesStep.styled";
interface SavedPlacesStepProps {
  draft: TripDraft;
  onChange: (draft: TripDraft) => void;
  onNext: () => void;
  onLoadingChange: (loading: boolean) => void;
}
const categories: ("전체" | PlaceCategory)[] = [
  "전체",
  "맛집",
  "카페",
  "명소",
  "쇼핑",
];
const categoryIcons = {
  맛집: food,
  카페: cafe,
  명소: camera,
  쇼핑: shopping,
  산책: camera,
};
function SavedPlacesStep({
  draft,
  onChange,
  onNext,
  onLoadingChange,
}: SavedPlacesStepProps) {
  const [tab, setTab] = useState<"saved" | "courses">("saved");
  const [category, setCategory] = useState<"전체" | PlaceCategory>("전체");
  const [query, setQuery] = useState("");
  const [placeToMatch, setPlaceToMatch] = useState<TripPlace | null>(null);
  const [matchQuery, setMatchQuery] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    onLoadingChange(busy);
    return () => onLoadingChange(false);
  }, [busy, onLoadingChange]);
  const [error, setError] = useState("");
  const [course, setCourse] = useState<PlaceCourse | null>(null);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [largeMap, setLargeMap] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const { places: catalog, courses } = mockTripCatalog[draft.city];
  const matchKeyword = matchQuery.trim().toLowerCase();
  const matchResults = matchKeyword
    ? catalog.filter((candidate) =>
        candidate.title.toLowerCase().includes(matchKeyword),
      )
    : [];
  const recommendedPlaces = showAllRecommended ? catalog : catalog.slice(0, 4);
  const selectedIds = new Set(draft.selectedPlaceIds);
  const pendingSelection = new Set(pendingIds);
  const ready = draft.source !== "none";
  const emptySaved = ready && tab === "saved" && !draft.places.length;
  const list = draft.places.filter(
    (place) =>
      (category === "전체" || place.category === category) &&
      (!query.trim() ||
        place.title.toLowerCase().includes(query.trim().toLowerCase())),
  );
  const selected = draft.places.filter((place) => selectedIds.has(place.id));
  const selectable = list.filter((place) => !place.needsMatch && !place.closed);
  const allSelected =
    selectable.length > 0 &&
    selectable.every((place) => selectedIds.has(place.id));
  async function connect() {
    if (request.current && !request.current.signal.aborted) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError("");
    try {
      const places = await importMockPlaces(draft.city, controller.signal);
      if (!controller.signal.aborted)
        onChange({
          ...draft,
          source: "mock",
          places: mergePlaces(draft.places, places),
        });
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : "장소를 불러오지 못했어요. 다시 시도해 주세요.",
        );
    } finally {
      if (!controller.signal.aborted) {
        setBusy(false);
        request.current = null;
      }
    }
  }
  function togglePlace(place: TripPlace) {
    const places = mergePlaces(draft.places, [place]);
    const canonical = places.find(
      (item) =>
        item.id === place.id ||
        (item.title === place.title && item.city === place.city),
    )!;
    onChange({
      ...draft,
      places,
      selectedPlaceIds: toggleId(draft.selectedPlaceIds, canonical.id),
    });
  }
  function matchPlace(place: TripPlace, id: string) {
    const matched = catalog.find((item) => item.id === id);
    if (!matched) return;
    const other = draft.places.filter((item) => item.id !== place.id);
    onChange({
      ...draft,
      places: mergePlaces(other, [matched]),
      selectedPlaceIds: [
        ...new Set(
          draft.selectedPlaceIds.map((item) =>
            item === place.id ? matched.id : item,
          ),
        ),
      ],
    });
  }
  function renderPlace(place: TripPlace) {
    const checked = selectedIds.has(place.id);
    return (
      <P.PlaceRow key={place.id}>
        {place.image && <img src={place.image} alt="" />}
        <label>
          <div>
            <strong>{place.title}</strong>
            <small>{place.needsMatch ? "확인 필요" : place.category}</small>
            <p>{place.description}</p>
          </div>
          <P.Checkbox
            type="checkbox"
            aria-label={`${place.title} 선택`}
            disabled={place.needsMatch}
            checked={checked}
            onChange={() => togglePlace(place)}
          />
        </label>
        {place.needsMatch && (
          <P.MatchButton
            type="button"
            onClick={() => {
              setMatchQuery("");
              setPlaceToMatch(place);
            }}
          >
            장소 직접 검색
          </P.MatchButton>
        )}
      </P.PlaceRow>
    );
  }
  const detailPlaces =
    courses.find((item) => item.id === course?.id)?.places ?? [];
  return (
    <>
      {busy ? (
        <P.LoadingState role="status" aria-live="polite">
          <P.LoadingCharacter src={character} alt="" />
          <h2>저장한 장소를 불러오고 있어요</h2>
          <p>{draft.city}에서 장소를 찾고 있어요</p>
          <img src={loadingDots} alt="" />
        </P.LoadingState>
      ) : !ready ? (
        <P.ConnectStep>
          <header>
            <S.Title>
              구글맵에 저장한 장소로
              <br />
              코스를 짜드릴게요
            </S.Title>
            <S.Subtitle>
              저장해 둔 맛집, 카페, 명소를 그대로 가져와요
            </S.Subtitle>
          </header>
          <P.ConnectVisual>
            <img src={purple} alt="" />
            <img src={cyan} alt="" />
            <P.MapsBox>
              <img src={maps} alt="Google Maps" />
            </P.MapsBox>
            {[
              { label: "맛집 18", icon: foodSmall },
              { label: "카페 9", icon: cafeSmall },
              { label: "명소 12", icon: cameraSmall },
            ].map((item, index) => (
              <P.FloatingChip key={item.label} $position={index}>
                <img src={item.icon} alt="" />
                {item.label}
              </P.FloatingChip>
            ))}
          </P.ConnectVisual>
          {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
        </P.ConnectStep>
      ) : (
        <P.PlacesStep $empty={emptySaved}>
          <header>
            <P.PlacesTitle>여행에 담을 장소를 골라주세요</P.PlacesTitle>
            <S.Subtitle>
              {tab === "courses"
                ? "코스에 포함된 장소를 확인하고 선택해 보세요"
                : draft.source === "manual"
                  ? `${draft.city} 인기 장소나 추천 코스에서 바로 담을 수 있어요`
                  : "Google Maps에 저장한 장소를 불러왔어요"}
            </S.Subtitle>
          </header>
          <P.PlaceTabs>
            <button
              type="button"
              aria-pressed={tab === "saved"}
              onClick={() => setTab("saved")}
            >
              {draft.source === "manual" ? "인기 장소" : "저장 장소"}
            </button>
            <button
              type="button"
              aria-pressed={tab === "courses"}
              onClick={() => setTab("courses")}
            >
              추천 코스
            </button>
          </P.PlaceTabs>
          {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
          {tab === "saved" ? (
            draft.places.length ? (
              <>
                <S.PlaceControls>
                  <span>
                    {draft.city}
                    {draft.source === "manual"
                      ? " 추천 장소"
                      : "에 저장한 장소"}{" "}
                    <b>
                      {draft.source === "mock"
                        ? (mockSavedPlaceCounts[draft.city] ??
                          draft.places.length)
                        : draft.places.length}
                      곳
                    </b>
                  </span>
                  <label>
                    <P.Checkbox
                      type="checkbox"
                      aria-label="전체 선택"
                      checked={allSelected}
                      disabled={!selectable.length}
                      onChange={() => {
                        const ids = selectable.map((place) => place.id);
                        onChange({
                          ...draft,
                          selectedPlaceIds: allSelected
                            ? draft.selectedPlaceIds.filter(
                                (id) => !ids.includes(id),
                              )
                            : [...new Set([...draft.selectedPlaceIds, ...ids])],
                        });
                      }}
                    />
                    전체 선택
                  </label>
                </S.PlaceControls>
                {draft.source === "manual" && (
                  <S.Search>
                    <img src={searchIcon} alt="" />
                    <input
                      aria-label="장소 검색"
                      placeholder="가고 싶은 곳을 검색해 보세요"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </S.Search>
                )}
                <P.Categories>
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={category === item}
                      onClick={() => setCategory(item)}
                    >
                      {item !== "전체" && (
                        <img src={categoryIcons[item]} alt="" />
                      )}
                      {item}
                    </button>
                  ))}
                </P.Categories>
                <P.PlaceList>
                  {list.map((place) => renderPlace(place))}
                </P.PlaceList>
              </>
            ) : (
              <P.EmptyState>
                <P.EmptyArt>
                  <img src={emptyGlow} alt="" />
                  <P.LoadingCharacter src={emptyImage} alt="" />
                </P.EmptyArt>
                <h2>{draft.city}에 저장한 장소가 없어요</h2>
                <p>
                  {draft.city} 인기 장소나 추천 코스에서 바로 담을 수 있어요
                </p>
              </P.EmptyState>
            )
          ) : (
            <>
              <S.PlaceControls>
                <span>
                  {draft.city} 추천 코스 <b>{courses.length}개</b>
                </span>
              </S.PlaceControls>
              {courses.map((item) => {
                const photos = item.places;
                return (
                  <P.CourseCard key={item.id}>
                    <h3>{item.title}</h3>
                    <p>
                      장소 {photos.length}곳
                      {item.savedLabel ? ` · ${item.savedLabel}` : ""}
                    </p>
                    <P.CoursePhotos>
                      {photos.slice(0, 3).map((place) => (
                        <img key={place.id} src={place.image} alt="" />
                      ))}
                    </P.CoursePhotos>
                    <P.CoursePath>
                      {photos.map((place, index) => (
                        <span key={place.id}>
                          {index > 0 && <img src={chevronIcon} alt="" />}
                          {place.title}
                        </span>
                      ))}
                    </P.CoursePath>
                    <S.Help>
                      코스를 열어 원하는 장소만 골라 담을 수 있어요
                    </S.Help>
                    <button
                      type="button"
                      onClick={() => {
                        setPendingIds(draft.selectedPlaceIds);
                        setCourse(item);
                        setLargeMap(false);
                      }}
                    >
                      코스 자세히 보기 <img src={chevronIcon} alt="" />
                    </button>
                  </P.CourseCard>
                );
              })}
              <P.RecommendHeading>
                <div>
                  <strong>이런 장소도 있어요!</strong>
                  <S.Help>
                    {draft.city} 추천 장소 <b>{recommendedPlaces.length}개</b>
                  </S.Help>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllRecommended(true)}
                >
                  전체 보기 <img src={chevronIcon} alt="" />
                </button>
              </P.RecommendHeading>
              <P.PlaceList>
                {recommendedPlaces.map((place) => renderPlace(place))}
              </P.PlaceList>
            </>
          )}
        </P.PlacesStep>
      )}
      {!busy && (
        <S.Footer>
          {!ready ? (
            <>
              <S.Primary type="button" onClick={connect}>
                구글 계정으로 연결하기
              </S.Primary>
              <S.TextButton
                type="button"
                onClick={() => {
                  onChange({
                    ...draft,
                    source: "manual",
                    places: mergePlaces(draft.places, catalog),
                  });
                  setTab("saved");
                }}
              >
                나중에 할게요
              </S.TextButton>
            </>
          ) : emptySaved ? (
            <S.Primary type="button" onClick={() => setTab("courses")}>
              추천 코스에서 장소 고르기
            </S.Primary>
          ) : (
            <S.Primary
              type="button"
              disabled={!!placesError(draft)}
              onClick={onNext}
            >
              {selected.length
                ? `선택한 장소 ${selected.length}곳 담기`
                : "장소를 선택해 주세요"}
            </S.Primary>
          )}
        </S.Footer>
      )}
      {placeToMatch && (
        <TripSheet
          title="장소 이름으로 검색"
          onClose={() => setPlaceToMatch(null)}
        >
          <S.Help>이 핀이 가리키는 장소의 이름을 입력해 주세요.</S.Help>
          <S.Search>
            <img src={searchIcon} alt="" />
            <input
              type="search"
              aria-label="매칭할 장소 이름"
              placeholder="장소 이름을 입력해 주세요"
              value={matchQuery}
              onChange={(event) => setMatchQuery(event.target.value)}
            />
          </S.Search>
          {matchKeyword && matchResults.length === 0 && (
            <S.Help role="status">검색 결과가 없어요.</S.Help>
          )}
          <P.PlaceList>
            {matchResults.map((candidate) => (
              <P.MatchButton
                key={candidate.id}
                type="button"
                onClick={() => {
                  matchPlace(placeToMatch, candidate.id);
                  setPlaceToMatch(null);
                }}
              >
                {candidate.title} · {candidate.category}
              </P.MatchButton>
            ))}
          </P.PlaceList>
        </TripSheet>
      )}
      {course && (
        <TripSheet
          variant="course"
          title={largeMap ? "지도 크게 보기" : course.title}
          onClose={() => (largeMap ? setLargeMap(false) : setCourse(null))}
          footer={
            !largeMap && (
              <S.Primary
                type="button"
                disabled={!pendingIds.length}
                onClick={() => {
                  onChange({
                    ...draft,
                    places: mergePlaces(draft.places, detailPlaces),
                    selectedPlaceIds: [...new Set(pendingIds)],
                  });
                  setCourse(null);
                }}
              >
                선택한 장소 {pendingIds.length}곳 담기
              </S.Primary>
            )
          }
        >
          <S.Help>
            장소 {detailPlaces.length}곳
            {course.savedLabel ? ` · ${course.savedLabel}` : ""}
          </S.Help>
          <P.CourseMap>
            <P.DetailMap
              src={routeImage}
              alt="추천 코스 경로 지도"
              $expanded={largeMap}
            />
            {!largeMap && (
              <button type="button" onClick={() => setLargeMap(true)}>
                지도 크게 보기
              </button>
            )}
          </P.CourseMap>
          {!largeMap && (
            <>
              <P.PlaceList>
                {detailPlaces.map((place, index) => (
                  <P.CourseStop key={place.id}>
                    <P.StopRail>
                      <span>{index + 1}</span>
                    </P.StopRail>
                    <P.StopContent>
                      <P.StopCard>
                        <img src={place.image} alt="" />
                        <label>
                          <div>
                            <strong>{place.title}</strong>
                            <p>
                              {mockCourseStopDetails[index]?.time && (
                                <>
                                  <b>{mockCourseStopDetails[index].time}</b>
                                  <span> | </span>
                                </>
                              )}
                              {place.category}
                            </p>
                          </div>
                          <P.Checkbox
                            type="checkbox"
                            aria-label={`${place.title} 선택`}
                            checked={pendingSelection.has(place.id)}
                            onChange={() =>
                              setPendingIds((ids) => toggleId(ids, place.id))
                            }
                          />
                        </label>
                      </P.StopCard>
                      {index < detailPlaces.length - 1 &&
                        mockCourseStopDetails[index]?.move && (
                          <P.StopMove>
                            <b>{mockCourseStopDetails[index].move}</b>
                            <span>
                              {" "}
                              | {mockCourseStopDetails[index].distance}
                            </span>
                          </P.StopMove>
                        )}
                    </P.StopContent>
                  </P.CourseStop>
                ))}
              </P.PlaceList>
            </>
          )}
        </TripSheet>
      )}
    </>
  );
}
export default SavedPlacesStep;

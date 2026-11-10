import { useState } from "react";
import { useNavigate } from "react-router";
import backIcon from "../assets/figma/traveler-back.svg";
import calendarIcon from "../assets/figma/traveler-calendar.svg";
import heartIcon from "../assets/figma/traveler-heart.svg";
import heartFilledIcon from "../assets/figma/traveler-heart-filled.svg";
import pinIcon from "../assets/figma/traveler-pin.svg";
import trainIcon from "../assets/figma/traveler-train.svg";
import walkIcon from "../assets/figma/traveler-walk.svg";
import { routes } from "../config/routes";
import { travelerCourse } from "../data/mocks/travelerCourseData";
import TravelerCourseMap from "../components/traveler-course/TravelerCourseMap";
import TravelerPlaceDetail from "../components/traveler-course/TravelerPlaceDetail";
import * as S from "./TravelerCoursePage.styled";
import { importedTripPath } from "../utils/navigation";

const SAVED_KEY = `dotlo:saved-traveler-course:${travelerCourse.id}`;

function readSavedState() {
  try {
    return localStorage.getItem(SAVED_KEY) === "true";
  } catch {
    return false;
  }
}

function TravelerCoursePage() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(0);
  const [isSaved, setIsSaved] = useState(readSavedState);
  const [notice, setNotice] = useState("");
  const [screen, setScreen] = useState<"course" | "map" | "place">("course");
  const day = travelerCourse.days[activeDay];

  const toggleSaved = () => {
    const next = !isSaved;
    setIsSaved(next);
    setNotice(next ? "찜한 코스에 담았어요" : "찜한 코스에서 뺐어요");
    try {
      localStorage.setItem(SAVED_KEY, String(next));
    } catch {
      // 저장소를 사용할 수 없어도 목업 화면은 계속 동작합니다.
    }
  };

  const importCourse = () => {
    try {
      localStorage.setItem(
        `dotlo:imported-course:${travelerCourse.id}`,
        JSON.stringify({ id: travelerCourse.id, importedAt: new Date().toISOString() }),
      );
    } catch {
      // 저장소를 사용할 수 없어도 화면 이동은 계속합니다.
    }
    navigate(`${importedTripPath("kyoto")}?toast=course-imported`);
  };

  if (screen === "map") {
    return (
      <TravelerCourseMap
        activeDay={activeDay}
        onBack={() => setScreen("course")}
        onDayChange={setActiveDay}
        onOpenPlace={() => setScreen("place")}
      />
    );
  }

  if (screen === "place") {
    return <TravelerPlaceDetail onBack={() => setScreen("map")} />;
  }

  return (
    <S.Shell>
      <S.Hero>
        <img src={travelerCourse.hero} alt="교토의 전통 골목" />
        <S.Navigation aria-label="여행자 코스 탐색">
          <button type="button" aria-label="코스 목록으로 돌아가기" onClick={() => navigate(routes.courses)}>
            <img src={backIcon} alt="" />
          </button>
          <strong>여행자 코스</strong>
          <S.Heart type="button" $saved={isSaved} aria-label={isSaved ? "코스 찜 해제" : "코스 찜하기"} onClick={toggleSaved}>
            <img src={isSaved ? heartFilledIcon : heartIcon} alt="" />
          </S.Heart>
        </S.Navigation>
      </S.Hero>

      <S.Content>
        <S.Intro>
          <div>
            <S.Tags>
              {travelerCourse.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </S.Tags>
            <h1>{travelerCourse.title}</h1>
          </div>
          <S.Author>
            <img src={travelerCourse.authorImage} alt="" />
            <div>
              <strong>{travelerCourse.author}</strong>
              <small>{travelerCourse.authorNote}　|　{travelerCourse.publishedAt}</small>
            </div>
          </S.Author>
          <p>{travelerCourse.description}</p>
        </S.Intro>

        <S.Facts aria-label="코스 요약">
          <div><img src={calendarIcon} alt="" /><strong>{travelerCourse.duration}</strong><span>여행 기간</span></div>
          <div><img src={pinIcon} alt="" /><strong>{travelerCourse.placeCount}곳</strong><span>방문 장소</span></div>
          <div><img src={trainIcon} alt="" /><strong>{travelerCourse.transport}</strong><span>이동 방법</span></div>
        </S.Facts>

        <S.Days>
          <S.SectionHeading><h2>일차별 코스</h2><span>전체 {travelerCourse.placeCount}곳</span></S.SectionHeading>
          <S.DayTabs role="tablist" aria-label="여행 일차">
            {travelerCourse.days.map((item, index) => (
              <button key={item.label} type="button" role="tab" aria-selected={activeDay === index} onClick={() => setActiveDay(index)}>
                {item.label}
              </button>
            ))}
          </S.DayTabs>
          <S.MapPreview type="button" aria-label={`${day.label} 지도 전체 보기`} onClick={() => setScreen("map")}>
            <img src={travelerCourse.routePreview} alt="교토 여행 경로 지도" />
            <span>지도 크게 보기</span>
          </S.MapPreview>
          <S.PlaceList>
            {day.places.map((place, index) => (
              <S.PlaceRow key={place.id}>
                <S.Rail><b>{index + 1}</b>{index < day.places.length - 1 && <i />}</S.Rail>
                <S.PlaceContent>
                  <S.PlaceCard type="button" onClick={() => setScreen("place")}>
                    <img src={place.image} alt="" />
                    <span><strong>{place.name}</strong><small>{place.category}</small></span>
                  </S.PlaceCard>
                  {place.travelTime && <S.Move><img src={walkIcon} alt="" />{place.travelTime}<span>{place.distance}</span></S.Move>}
                </S.PlaceContent>
              </S.PlaceRow>
            ))}
          </S.PlaceList>
        </S.Days>
      </S.Content>

      <S.Cta><button type="button" onClick={importCourse}>내 일정으로 가져오기</button></S.Cta>
      {notice && <S.Toast role="status"><b>✓</b>{notice}</S.Toast>}
    </S.Shell>
  );
}

export default TravelerCoursePage;


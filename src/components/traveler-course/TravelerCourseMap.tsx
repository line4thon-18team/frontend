import { travelerCourse } from "../../data/mocks/travelerCourseData";
import backIcon from "../../assets/figma/map-back.svg";
import * as S from "./TravelerCourseOverlay.styled";

interface TravelerCourseMapProps {
  activeDay: number;
  onBack: () => void;
  onDayChange: (day: number) => void;
  onOpenPlace: (placeId: string) => void;
}

const pinPositions = [
  { x: 80, y: 35 },
  { x: 60, y: 27 },
  { x: 47, y: 20 },
  { x: 22, y: 8 },
];

function TravelerCourseMap({ activeDay, onBack, onDayChange, onOpenPlace }: TravelerCourseMapProps) {
  const day = travelerCourse.days[activeDay];

  return (
    <S.MapScreen>
      <S.MapHeader>
        <div><button type="button" aria-label="코스 상세로 돌아가기" onClick={onBack}><img src={backIcon} alt="" /></button><h1>교토 2박 3일</h1><span /></div>
        <S.MapTabs aria-label="지도 일차 선택">
          <button type="button" aria-pressed={false} onClick={() => onDayChange(0)}>전체</button>
          {travelerCourse.days.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={activeDay === index} onClick={() => onDayChange(index)}>{item.label}</button>
          ))}
        </S.MapTabs>
      </S.MapHeader>
      <S.MapCanvas>
        <img src={travelerCourse.mapFull} alt="교토 코스 전체 지도" />
        {pinPositions.map((pin, index) => (
          <S.MapPin key={`${pin.x}-${pin.y}`} type="button" $x={pin.x} $y={pin.y} onClick={() => onOpenPlace(day.places[Math.min(index, day.places.length - 1)].id)} aria-label={`${index + 1}번 장소 열기`}>
            {index + 1}
          </S.MapPin>
        ))}
      </S.MapCanvas>
      <S.DaySheet>
        <h2>{day.label}</h2>
        <p>장소 {day.places.length}곳　|　도보 {activeDay === 0 ? "2.4km" : "1.8km"}</p>
        {day.places.map((place, index) => (
          <S.MapPlaceRow key={place.id} type="button" onClick={() => onOpenPlace(place.id)}>
            <b>{index + 1}</b><img src={place.image} alt="" /><span><strong>{place.name}</strong><small>{place.category}</small></span>
          </S.MapPlaceRow>
        ))}
      </S.DaySheet>
    </S.MapScreen>
  );
}

export default TravelerCourseMap;


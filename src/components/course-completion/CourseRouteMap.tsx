import routeMap from "../../assets/course-completion/route-map.png";
import type { CoursePlace } from "../../types/courseCompletion";
import "./CourseCompletion.css";

interface CourseRouteMapProps {
  places: Array<Pick<CoursePlace, "name" | "latitude" | "longitude"> & {
    id: number | string;
    order?: number;
  }>;
  city: string;
  day: number;
  schematic?: boolean;
  expanded?: boolean;
}

function CourseRouteMap({ places, city, day, schematic = false, expanded = false }: CourseRouteMapProps) {
  const rows = Math.max(1, Math.ceil(places.length / 3));
  const hasCoordinates = places.every((place) =>
    Number.isFinite(place.latitude) && Number.isFinite(place.longitude),
  );
  const latitudes = places.map((place) => place.latitude ?? 0);
  const longitudes = places.map((place) => place.longitude ?? 0);
  const minLatitude = Math.min(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const latitudeRange = Math.max(.001, Math.max(...latitudes) - minLatitude);
  const longitudeRange = Math.max(.001, Math.max(...longitudes) - minLongitude);
  const pins = places.map((place, index) => ({
    id: place.id,
    name: place.name,
    order: place.order ?? index + 1,
    x: hasCoordinates ? 10 + ((place.longitude! - minLongitude) / longitudeRange) * 70 : 15 + (index % 3) * 35,
    y: hasCoordinates ? 80 - ((place.latitude! - minLatitude) / latitudeRange) * 60 : 20 + Math.floor(index / 3) * (60 / Math.max(1, rows - 1)),
  }));

  return (
    <div className={`course-map${expanded ? " course-map--expanded" : ""}`} aria-label={`${day}일차 ${city} ${schematic ? "장소 배치도" : "샘플 경로"}`}>
      {!schematic && city === "오사카" && <img className="course-map__base" src={routeMap} alt="오사카 샘플 지도" />}
      <svg className="course-map__route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points={pins.map((pin) => `${pin.x},${pin.y}`).join(" ")}
          fill="none"
          stroke="#00c6df"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {pins.map((pin) => (
        <span className="course-map__pin" style={{ left: `${pin.x}%`, top: `${pin.y}%` }} key={pin.id} title={pin.name}>
          {pin.order}
        </span>
      ))}
      <small className="course-map__caption">{day}일차 · {places.length}곳 · {schematic ? "방문 순서" : "샘플 경로"}</small>
      <ol className="course-live-region">{places.map((place) => <li key={place.id}>{place.name}</li>)}</ol>
    </div>
  );
}

export default CourseRouteMap;

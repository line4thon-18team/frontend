import { useState } from "react";
import placeDetailActions from "../../assets/course-completion/place-detail-actions.svg";
import placeDetailBack from "../../assets/course-completion/place-detail-back.svg";
import placeDetailMap from "../../assets/course-completion/place-detail-map.png";
import placeDetailPhoto from "../../assets/course-completion/place-detail-photo.png";
import mapIcon from "../../assets/figma/traveler-pin.svg";
import infoIcon from "../../assets/course-completion/unplaced-info.svg";
import chevronIcon from "../../assets/icons/nav-chevron-down.svg";
import CompanionOpinions from "../course-community/CompanionOpinions";
import type { CoursePlace } from "../../types/courseCompletion";

interface PlaceDetailProps {
  place: CoursePlace;
  onBack: () => void;
  onRemove: () => void;
}

function PlaceDetail({ place, onBack, onRemove }: PlaceDetailProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <main className="place-detail" aria-label={`${place.name} 상세`}>
      <header className="place-detail__hero">
        <img src={placeDetailPhoto} alt="오사카 도톤보리 풍경" />
        <div className="place-detail__scrim" />
        <div className="place-detail__nav">
          <button type="button" onClick={onBack} aria-label="코스로 돌아가기">
            <img src={placeDetailBack} alt="" />
          </button>
          <span />
          <button type="button" aria-label="지도에서 보기"><img src={mapIcon} alt="" /></button>
          <button type="button" aria-label="더 보기">
            <img src={placeDetailActions} alt="" />
          </button>
        </div>
      </header>

      <div className="place-detail__body">
        <div className="place-detail__chips">
          <span>맛집</span>
          <span>내가 저장</span>
        </div>
        <h1>{place.name}</h1>
        <p className="place-detail__english">Kuromon Ichiba Market</p>
        <div className="place-detail__rating">
          <strong>★ 4.3</strong>
          <span>리뷰 8,500</span>
          <span>오사카 난바</span>
          <button type="button">지도 보기</button>
        </div>

        <button
          className="place-detail__more-info"
          type="button"
          aria-expanded={detailsExpanded}
          onClick={() => setDetailsExpanded((current) => !current)}
        >
          <img src={infoIcon} alt="" />
          영업시간, 위치 등 장소 정보 보기
          <img className={detailsExpanded ? "is-expanded" : ""} src={chevronIcon} alt="" />
        </button>

        <CompanionOpinions />

        {detailsExpanded && (
          <>
            <section>
              <h2>소개</h2>
              <p>
                190년 넘게 이어진 오사카의 부엌이에요. 해산물 꼬치, 와규
                꼬치, 제철 과일을 가게 앞에서 바로 먹을 수 있어요. 지붕이 있는
                아케이드라 비가 와도 다니기 좋아요.
              </p>
              <div className="place-detail__tags">
                <span>해산물 꼬치</span>
                <span>길거리 음식</span>
                <span>실내 아케이드</span>
              </div>
            </section>

            <section>
              <h2>정보</h2>
              <dl className="place-detail__info">
                <div><dt>영업시간</dt><dd><b>오늘 영업 중</b><br />09:00 - 18:00 <button type="button">요일별 보기</button></dd></div>
                <div><dt>휴무</dt><dd>가게마다 달라요, 일요일 휴무 많음</dd></div>
                <div><dt>주소</dt><dd>1 Chome-15-6 Nippombashi, Chuo Ward <button type="button">복사</button></dd></div>
                <div><dt>가는 법</dt><dd>난바역 도보 6분, 숙소에서 도보 5분 <button type="button">길찾기</button></dd></div>
                <div><dt>전화</dt><dd>+81 6-6631-0007</dd></div>
                <div><dt>예약</dt><dd>예약 없이 방문</dd></div>
              </dl>
            </section>

            <section>
              <h2>위치</h2>
              <div className="place-detail__map">
                <img src={placeDetailMap} alt="구로몬 시장 위치 지도" />
                <span>1</span>
              </div>
              <button className="place-detail__map-link" type="button">구글맵에서 열기</button>
            </section>

            <section className="place-detail__review">
              <h2>리뷰</h2>
              <b>구글 리뷰 8,500개</b>
              <article>
                <strong>여행자 리뷰 요약</strong>
                <p>오전에 가야 신선하고 덜 붐벼요. 현금만 받는 가게가 많아요.</p>
              </article>
              <article>
                <strong>minji 님</strong>
                <p>참치 꼬치랑 딸기 모찌가 제일 맛있었어요. 한 바퀴 도는 데 40분쯤 걸려요.</p>
              </article>
              <button type="button">리뷰 더 보기</button>
            </section>

            <div className="place-detail__quick-actions">
              <button type="button">비슷한 곳으로 바꾸기</button>
              <button type="button">일차 옮기기</button>
              <button type="button" onClick={onRemove}>일정에서 빼기</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default PlaceDetail;

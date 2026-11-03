import heroImage from '../../assets/trip/hero.png'
import sheetHeroImage from '../../assets/trip/sheet-hero.png'
import mapImage from '../../assets/trip/map.png'
import aiBadgeImage from '../../assets/trip/ai-badge.png'
import routeLine1 from '../../assets/trip/route-line-1.svg'
import routeLine2 from '../../assets/trip/route-line-2.svg'
import routeLine3 from '../../assets/trip/route-line-3.svg'
import routeLine4 from '../../assets/trip/route-line-4.svg'
import routeLine5 from '../../assets/trip/route-line-5.svg'
import type { Place } from '../../data/tripPlan'

type OverviewMode = 'initial' | 'result' | 'applied'

type TripOverviewProps = {
  mode: OverviewMode
  activeDay: number
  places: Place[]
  onDayChange: (day: number) => void
  onAddPlace: () => void
}

const dayLabels = [
  ['1일차', '5.18'],
  ['2일차', '5.19'],
  ['3일차', '5.20'],
  ['4일차', '5.21'],
]

function Header({ mode }: { mode: OverviewMode }) {
  return (
    <header className={`trip-hero trip-hero--${mode}`}>
      <img
        className="trip-hero__image"
        src={mode === 'initial' ? heroImage : sheetHeroImage}
        alt="오사카 여행지"
      />
      <div className="trip-hero__shade" />
      <div className="trip-hero__topbar">
        <button className="icon-button icon-button--light" type="button" aria-label="뒤로 가기">
          ‹
        </button>
        {mode === 'initial' && <span className="trip-hero__section-title">AI 여행 코스</span>}
        <button className="icon-button icon-button--light" type="button" aria-label="설정 열기">
          ⚙
        </button>
      </div>
      <div className="trip-hero__copy">
        {mode === 'initial' && <span className="trip-hero__eyebrow">오사카</span>}
        <h1>오사카 3박 4일</h1>
        <p>{mode === 'initial' ? '2026.05.18 (월) - 05.21 (목)' : '5.18 월 ~ 5.21 목 · 부모님과 3명'}</p>
      </div>
    </header>
  )
}

function TripSummary({ mode }: { mode: OverviewMode }) {
  const isRelaxed = mode !== 'initial'

  return (
    <section className="trip-summary" aria-label="여행 요약">
      {mode === 'initial' && (
        <div className="ai-intro">
          <img src={aiBadgeImage} alt="" />
          <div>
            <span>도틀로 AI의 한줄 구성</span>
            <strong>부모님과 함께하는 여행을 고려해<br />덜 걷고 여유롭게 구성했어요</strong>
          </div>
        </div>
      )}

      <div className="trip-stats">
        <div><strong>{isRelaxed ? '11곳' : '2박 3일'}</strong><span>{isRelaxed ? '장소' : '여행 기간'}</span></div>
        <div><strong>{isRelaxed ? '하루 3곳' : '12곳'}</strong><span>{isRelaxed ? '더 여유로운 일정' : '장소'}</span></div>
        <div><strong>{isRelaxed ? '0.7km' : '도보와 버스'}</strong><span>{isRelaxed ? '1일차 도보' : '이동 방법'}</span></div>
      </div>

      {mode === 'result' && (
        <div className="ai-change-card">
          <span>✧ 이렇게 바꿔봤어요</span>
          <strong>1일차에서 카페를 빼고,<br />숙소에서 쉬는 시간을 넣었어요</strong>
          <small>요청: 첫날은 좀 여유롭게, 카페는 빼도 괜찮아요</small>
        </div>
      )}

      {mode === 'applied' && (
        <div className="ai-change-card">
          <span>✧ AI 한줄평</span>
          <strong>부모님과 덜 걷고 천천히,<br />첫날은 쉬는 시간을 넉넉히 넣었어요</strong>
        </div>
      )}
    </section>
  )
}

function TripMap() {
  return (
    <div className="trip-map" aria-label="1일차 이동 경로 지도">
      <img className="trip-map__base" src={mapImage} alt="오사카 난바 지도" />
      <img className="route-line route-line--1" src={routeLine1} alt="" />
      <img className="route-line route-line--2" src={routeLine2} alt="" />
      <img className="route-line route-line--3" src={routeLine3} alt="" />
      <img className="route-line route-line--4" src={routeLine4} alt="" />
      <img className="route-line route-line--5" src={routeLine5} alt="" />
      {[
        [1, 29, 9], [2, 49, 23], [3, 36, 47], [4, 34, 72], [5, 55, 78], [6, 49, 89],
      ].map(([number, left, top]) => (
        <span key={number} className="map-pin" style={{ left: `${left}%`, top: `${top}%` }}>{number}</span>
      ))}
      <button type="button" className="map-expand">지도 크게 보기</button>
    </div>
  )
}

function PlaceTimeline({ places, mode }: { places: Place[]; mode: OverviewMode }) {
  return (
    <ol className="place-timeline">
      {places.map((place, index) => (
        <li key={place.id} className={place.name === '리로 커피 로스터스' && mode === 'result' ? 'place-row place-row--removed' : 'place-row'}>
          <span className="place-row__number">{index + 1}</span>
          <img className="place-row__image" src={place.image} alt="" />
          <div className="place-row__content">
            <div className="place-row__title-line">
              <strong>{place.name}</strong>
              {place.added && <span className="status-chip status-chip--added">새로 추가</span>}
              {place.name === '리로 커피 로스터스' && mode === 'result' && <span className="status-chip status-chip--removed">빠졌어요</span>}
            </div>
            <span>{place.detail}</span>
            <p>{place.note}</p>
            {index < places.length - 1 && <small>{place.travel}</small>}
          </div>
        </li>
      ))}
    </ol>
  )
}

function TripOverview({ mode, activeDay, places, onDayChange, onAddPlace }: TripOverviewProps) {
  return (
    <>
      <Header mode={mode} />
      <TripSummary mode={mode} />
      <section className="schedule-section">
        <h2>일정</h2>
        <div className="day-tabs" role="tablist" aria-label="여행 일자">
          {dayLabels.map(([label, date], index) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={activeDay === index + 1}
              className={activeDay === index + 1 ? 'day-tab day-tab--active' : 'day-tab'}
              onClick={() => onDayChange(index + 1)}
            >
              <strong>{label}</strong><span>{date}</span>
            </button>
          ))}
        </div>
        <TripMap />
        <div className="day-heading">
          <div><strong>천천히 즐기는 미식과 야경</strong><span>{mode === 'initial' ? '5곳' : '4곳'} · 도보 {mode === 'initial' ? '1.1km' : '0.7km'}</span></div>
        </div>
        <PlaceTimeline places={places} mode={mode} />
        <button className="add-place-button" type="button" onClick={onAddPlace}>＋ 장소 추가</button>
      </section>
    </>
  )
}

export default TripOverview

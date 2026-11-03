import { useState } from 'react'
import aiSymbol from '../assets/trip/ai-symbol.png'
import TripOverview from '../components/trip/TripOverview'
import {
  AddPlaceSheet,
  AiRequestSheet,
  EditDaySheet,
  ReplacePlaceSheet,
} from '../components/trip/TripSheets'
import {
  initialPlaces,
  relaxedPlaces,
  type CandidatePlace,
  type Place,
} from '../data/tripPlan'
import '../styles/trip-plan.css'

type OverviewMode = 'initial' | 'result' | 'applied'
type SheetMode = 'none' | 'request' | 'edit' | 'add' | 'replace'

function AiLoadingScreen({ onBack }: { onBack: () => void }) {
  return (
    <main className="ai-loading-screen">
      <button className="ai-loading-screen__back" type="button" onClick={onBack} aria-label="수정 취소">‹</button>
      <div className="ai-loading-screen__content">
        <div className="ai-orb"><img src={aiSymbol} alt="도틀로 AI" /></div>
        <h1>1일차 일정을<br />여유롭게 고치고 있어요</h1>
        <p>10초 정도 걸려요</p>
        <ol className="loading-steps">
          <li className="done">기존 일정 분석하기</li>
          <li className="done">빼도 되는 장소 고르기</li>
          <li className="current">이동 동선 다시 맞추기</li>
          <li>새 일정 정리하기</li>
        </ol>
      </div>
    </main>
  )
}

function TripPlanPage() {
  const [mode, setMode] = useState<OverviewMode>('initial')
  const [sheet, setSheet] = useState<SheetMode>('none')
  const [activeDay, setActiveDay] = useState(1)
  const [places, setPlaces] = useState<Place[]>(initialPlaces)
  const [replaceTarget, setReplaceTarget] = useState<Place | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }

  const handleAiSubmit = () => {
    setSheet('none')
    setIsLoading(true)
    window.setTimeout(() => {
      setPlaces(relaxedPlaces)
      setMode('result')
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
  }

  const handleApply = () => {
    setMode('applied')
    showToast('수정한 일정을 적용했어요')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUndo = () => {
    setMode('result')
    setToast(null)
  }

  const handleRemove = (placeId: number) => {
    setPlaces((current) => current.filter((place) => place.id !== placeId))
  }

  const handleMove = (from: number, to: number) => {
    setPlaces((current) => {
      if (current[from]?.fixed || current[to]?.fixed) return current
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const handleAddCandidates = (items: CandidatePlace[]) => {
    const addedPlaces: Place[] = items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      detail: `${item.category}, 오후`,
      note: `${item.distance} · 일정에 새로 추가했어요`,
      travel: '도보 8분 · 600m',
      image: item.image,
      added: true,
    }))
    setPlaces((current) => [...current, ...addedPlaces.filter((item) => !current.some((place) => place.id === item.id))])
    setSheet('edit')
  }

  const handleReplace = (item: CandidatePlace) => {
    if (!replaceTarget) return
    setPlaces((current) => current.map((place) => place.id === replaceTarget.id ? {
      ...place,
      name: item.name,
      category: item.category,
      detail: `${item.category}, 오후`,
      note: `${item.distance} · 동선에 맞춰 교체했어요`,
      image: item.image,
    } : place))
    setReplaceTarget(null)
    setSheet('edit')
  }

  if (isLoading) return <AiLoadingScreen onBack={() => setIsLoading(false)} />

  return (
    <div className="trip-page-shell">
      <main className="trip-page">
        <TripOverview
          mode={mode}
          activeDay={activeDay}
          places={places}
          onDayChange={setActiveDay}
          onAddPlace={() => setSheet('add')}
        />

        <div className={`trip-actions trip-actions--${mode}`}>
          {mode === 'initial' && (
            <button className="primary-button" type="button" onClick={() => setSheet('request')}>AI 수정 요청</button>
          )}
          {mode === 'result' && (
            <>
              <div className="trip-actions__row">
                <button className="secondary-button" type="button" onClick={() => setSheet('request')}>다시 수정</button>
                <button className="primary-button" type="button" onClick={handleApply}>이 일정 적용하기</button>
              </div>
              <button className="text-button" type="button" onClick={() => { setMode('initial'); setPlaces(initialPlaces) }}>기존 일정 보기</button>
            </>
          )}
          {mode === 'applied' && (
            <div className="trip-actions__row">
              <button className="secondary-button" type="button" onClick={() => setSheet('edit')}>일정 수정</button>
              <button className="primary-button" type="button" onClick={() => showToast('내 여행에 저장했어요')}>내 여행에 저장하기</button>
            </div>
          )}
        </div>

        {toast && (
          <div className="apply-toast" role="status">
            <span>✓</span><strong>{toast}</strong>
            {mode === 'applied' && <button type="button" onClick={handleUndo}>되돌리기</button>}
          </div>
        )}

        {sheet === 'request' && <AiRequestSheet onClose={() => setSheet('none')} onSubmit={handleAiSubmit} />}
        {sheet === 'edit' && (
          <EditDaySheet
            places={places}
            onClose={() => setSheet('none')}
            onAdd={() => setSheet('add')}
            onReplace={(place) => { setReplaceTarget(place); setSheet('replace') }}
            onRemove={handleRemove}
            onMove={handleMove}
            onSave={() => { setSheet('none'); showToast('1일차 수정을 저장했어요') }}
          />
        )}
        {sheet === 'add' && <AddPlaceSheet onClose={() => setSheet('edit')} onAdd={handleAddCandidates} />}
        {sheet === 'replace' && replaceTarget && (
          <ReplacePlaceSheet place={replaceTarget} onClose={() => setSheet('edit')} onReplace={handleReplace} />
        )}
      </main>
    </div>
  )
}

export default TripPlanPage

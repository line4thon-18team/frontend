import { useState, type DragEvent, type ReactNode } from 'react'
import aiSparkle from '../../assets/trip/ai-sparkle.svg'
import {
  addCandidates,
  replaceCandidates,
  type CandidatePlace,
  type Place,
} from '../../data/tripPlan'

type BottomSheetProps = {
  children: ReactNode
  className?: string
}

function BottomSheet({ children, className = '' }: BottomSheetProps) {
  return (
    <div className="sheet-backdrop" role="presentation">
      <section className={`bottom-sheet ${className}`} role="dialog" aria-modal="true">
        <div className="bottom-sheet__handle" />
        {children}
      </section>
    </div>
  )
}

function SheetHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="sheet-header">
      <h2>{title}</h2>
      <button className="sheet-close" type="button" onClick={onClose} aria-label="닫기">×</button>
    </div>
  )
}

const quickRequests = ['더 여유롭게', '덜 걷게', '맛집 더 넣기', '관광지 더 넣기', '야경 추가', '이동 동선 줄이기']

export function AiRequestSheet({ onClose, onSubmit }: { onClose: () => void; onSubmit: (request: string) => void }) {
  const [request, setRequest] = useState('첫날은 좀 여유롭게, 카페는 빼도 괜찮아요')

  return (
    <BottomSheet className="bottom-sheet--request">
      <SheetHeader title="어떤 걸 수정할까요?" onClose={onClose} />
      <p className="sheet-description">원하는 내용을 말하면 <img src={aiSparkle} alt="도틀로 AI" />가 여행 일정을 다시 조정해요</p>
      <div className="request-input-wrap">
        <textarea
          value={request}
          maxLength={200}
          onChange={(event) => setRequest(event.target.value)}
          aria-label="일정 수정 요청"
        />
        <span>{request.length} / 200</span>
      </div>
      <strong className="sheet-label">자주 하는 요청</strong>
      <div className="request-chips">
        {quickRequests.map((item) => (
          <button key={item} type="button" onClick={() => setRequest(item)}>{item}</button>
        ))}
      </div>
      <button className="primary-button sheet-primary" type="button" onClick={() => onSubmit(request)} disabled={!request.trim()}>
        수정 요청하기
      </button>
    </BottomSheet>
  )
}

type EditDaySheetProps = {
  places: Place[]
  onClose: () => void
  onAdd: () => void
  onReplace: (place: Place) => void
  onRemove: (placeId: number) => void
  onMove: (from: number, to: number) => void
  onSave: () => void
}

export function EditDaySheet({ places, onClose, onAdd, onReplace, onRemove, onMove, onSave }: EditDaySheetProps) {
  const handleDrop = (event: DragEvent<HTMLLIElement>, to: number) => {
    event.preventDefault()
    const from = Number(event.dataTransfer.getData('text/place-index'))
    if (Number.isInteger(from) && from !== to) onMove(from, to)
  }

  return (
    <BottomSheet className="bottom-sheet--edit">
      <SheetHeader title="일정 편집" onClose={onClose} />
      <div className="edit-day-tabs">
        {['1일차 5.18', '2일차 5.19', '3일차 5.20', '4일차 5.21'].map((day, index) => (
          <button key={day} className={index === 0 ? 'active' : ''} type="button">{day}</button>
        ))}
      </div>
      <div className="edit-summary"><strong>장소 {places.length}곳</strong><span>손잡이를 끌어 순서를 바꿔요</span></div>
      <ol className="edit-place-list">
        {places.map((place, index) => (
          <li
            key={place.id}
            draggable={!place.fixed}
            onDragStart={(event) => event.dataTransfer.setData('text/place-index', String(index))}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, index)}
          >
            <span className="drag-handle" aria-hidden="true">⠿</span>
            <span className={place.fixed ? 'edit-number edit-number--fixed' : 'edit-number'}>{index + 1}</span>
            <div><strong>{place.name}</strong><small>{place.note}</small></div>
            {place.fixed ? (
              <span className="fixed-chip">고정</span>
            ) : (
              <>
                <button className="replace-button" type="button" onClick={() => onReplace(place)}>교체</button>
                <button className="remove-button" type="button" onClick={() => onRemove(place.id)} aria-label={`${place.name} 삭제`}>×</button>
              </>
            )}
          </li>
        ))}
      </ol>
      <button className="outline-add-button" type="button" onClick={onAdd}>＋ 1일차에 장소 추가</button>
      <button className="primary-button sheet-primary" type="button" onClick={onSave}>1일차 수정 저장</button>
    </BottomSheet>
  )
}

function CandidateRow({ item, selected, onToggle }: { item: CandidatePlace; selected: boolean; onToggle: () => void }) {
  return (
    <button className={selected ? 'candidate-row candidate-row--selected' : 'candidate-row'} type="button" onClick={onToggle}>
      <img src={item.image} alt="" />
      <span><strong>{item.name}</strong><small>{item.category} · {item.distance}</small></span>
      <i aria-hidden="true">{selected ? '✓' : '+'}</i>
    </button>
  )
}

export function AddPlaceSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (items: CandidatePlace[]) => void }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([101, 103])
  const selectedItems = addCandidates.filter((item) => selectedIds.includes(item.id))

  const toggle = (id: number) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <BottomSheet className="bottom-sheet--places">
      <SheetHeader title="1일차에 장소 추가" onClose={onClose} />
      <label className="place-search"><span>⌕</span><input placeholder="장소, 맛집, 숙소 검색" /></label>
      <div className="category-tabs">
        {['추천', '저장한 곳', '관광', '맛집', '카페', '쇼핑'].map((item, index) => (
          <button key={item} className={index === 0 ? 'active' : ''} type="button">{item}</button>
        ))}
      </div>
      <p className="candidate-caption">지금 동선에서 가까운 순</p>
      <div className="candidate-list">
        {addCandidates.map((item) => (
          <CandidateRow key={item.id} item={item} selected={selectedIds.includes(item.id)} onToggle={() => toggle(item.id)} />
        ))}
      </div>
      <button className="primary-button sheet-primary" type="button" disabled={selectedItems.length === 0} onClick={() => onAdd(selectedItems)}>
        {selectedItems.length}곳을 1일차에 추가
      </button>
    </BottomSheet>
  )
}

export function ReplacePlaceSheet({ place, onClose, onReplace }: { place: Place; onClose: () => void; onReplace: (item: CandidatePlace) => void }) {
  const [selectedId, setSelectedId] = useState(201)
  const selected = replaceCandidates.find((item) => item.id === selectedId) ?? replaceCandidates[0]

  return (
    <BottomSheet className="bottom-sheet--places">
      <SheetHeader title="장소 교체" onClose={onClose} />
      <span className="sheet-label">바꿀 장소</span>
      <div className="current-place">
        <img src={place.image} alt="" />
        <span><strong>{place.name}</strong><small>{place.detail}</small></span>
      </div>
      <div className="filter-tabs">
        {['비슷한 곳', '더 가까운 곳', '내가 저장'].map((item, index) => (
          <button key={item} type="button" className={index === 0 ? 'active' : ''}>{item}</button>
        ))}
      </div>
      <p className="candidate-caption">분위기가 비슷한 카페예요</p>
      <div className="candidate-list">
        {replaceCandidates.map((item) => (
          <CandidateRow key={item.id} item={item} selected={selectedId === item.id} onToggle={() => setSelectedId(item.id)} />
        ))}
      </div>
      <button className="primary-button sheet-primary" type="button" onClick={() => onReplace(selected)}>
        {selected.name}(으)로 교체
      </button>
    </BottomSheet>
  )
}

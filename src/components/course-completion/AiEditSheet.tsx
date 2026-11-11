import aiSparkle from "../../assets/course-completion/ai-sparkle.svg";

interface AiEditSheetProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  error?: string;
}

const commonRequests = [
  "더 여유롭게",
  "덜 걷게",
  "맛집 더 넣기",
  "관광지 더 넣기",
  "야경 추가",
  "이동 동선 줄이기",
];

function AiEditSheet({ value, onChange, onClose, onSubmit, error = "" }: AiEditSheetProps) {
  return (
    <div className="course-overlay" role="presentation">
      <section className="course-sheet ai-edit-sheet" aria-label="AI 일정 수정 요청">
        <div className="course-sheet__handle" />
        <button className="course-sheet__close" type="button" onClick={onClose} aria-label="닫기">×</button>
        <div className="ai-edit-sheet__title">
          <img src={aiSparkle} alt="" />
          <div>
            <h2>어떤 걸 수정할까요?</h2>
            <p>원하는 내용을 말하면 AI가 여행 일정을 다시 조정해요</p>
          </div>
        </div>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="AI 수정 요청 내용"
          placeholder="첫날은 좀 여유롭게, 카페는 빼도 괜찮아요"
        />
        <h3>자주 하는 요청</h3>
        <div className="ai-edit-sheet__chips">
          {commonRequests.map((request) => (
            <button type="button" onClick={() => onChange(request)} key={request}>{request}</button>
          ))}
        </div>
        {error && <p className="ai-edit-sheet__error" role="alert">{error}</p>}
        <button className="course-sheet__primary" type="button" onClick={onSubmit} disabled={!value.trim()}>
          수정 요청하기
        </button>
      </section>
    </div>
  );
}

export default AiEditSheet;

import glow from "../../assets/course-completion/ai-loading-glow.svg";
import glowInner from "../../assets/course-completion/ai-loading-glow-inner.svg";
import dotDone from "../../assets/course-completion/ai-loading-done.svg";
import dotDoneSecondary from "../../assets/course-completion/ai-loading-done-secondary.svg";
import dotNow from "../../assets/course-completion/ai-loading-now.svg";
import pathDots from "../../assets/course-completion/ai-loading-path.svg";
import dotWait from "../../assets/course-completion/ai-loading-wait.svg";
import dotloLogo from "../../assets/course-completion/ai-loading-symbol.png";
import backIcon from "../../assets/course-completion/place-detail-back.svg";

interface AiEditLoadingProps {
  day: number;
  progress: number;
}

const labels = [
  "기존 일정 분석하기",
  "빼도 되는 장소 고르기",
  "이동 동선 다시 맞추기",
  "새 일정 정리하기",
] as const;

function AiEditLoading({ day, progress }: AiEditLoadingProps) {
  return (
    <main className="ai-loading">
      <button
        className="ai-loading__back"
        type="button"
        disabled
        aria-label="AI 수정 중에는 이전 화면으로 이동할 수 없어요"
      >
        <img src={backIcon} alt="" />
      </button>
      <div className="ai-loading__visual" aria-hidden="true">
        <img className="ai-loading__glow ai-loading__glow--one" src={glow} alt="" />
        <img className="ai-loading__glow ai-loading__glow--two" src={glowInner} alt="" />
        <div className="ai-loading__symbol"><img src={dotloLogo} alt="" /></div>
      </div>
      <h1>{day}일차 일정을<br />요청대로 고치고 있어요</h1>
      <p>최대 3분 정도 걸릴 수 있어요</p>
      <p className="ai-loading__notice">완료될 때까지 화면을 닫지 말아 주세요</p>
      <ol className="ai-loading__steps">
        {labels.map((label, index) => {
          const status = index < progress ? "is-done" : index === progress ? "is-current" : "is-waiting";
          const icon = index < progress ? (index === 0 ? dotDone : dotDoneSecondary) : index === progress ? dotNow : dotWait;
          return (
            <li className={status} key={label}>
              <img src={icon} alt="" />
              <span>{label}</span>
              {status === "is-current" && <img className="ai-loading__path-dots" src={pathDots} alt="" />}
            </li>
          );
        })}
      </ol>
    </main>
  );
}

export default AiEditLoading;

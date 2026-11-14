import { useEffect, useState } from "react";
import { Link } from "react-router";
import linkIcon from "../../assets/course-settings/link.svg";
import { createInvite } from "../../api/members";
import { createTripShare } from "../../api/trips";
import { routes } from "../../config/routes";
import { invitePath } from "../../utils/navigation";
import TripSheet from "../common/TripSheet";
import * as S from "./CourseSettings.styled";

export default function ServerInviteSheet({ tripId, onClose, publicShare = false }: {
  tripId: number;
  onClose: () => void;
  publicShare?: boolean;
}) {
  const title = publicShare ? "일정 공유" : "친구 초대";
  const linkLabel = publicShare ? "공유 링크" : "초대 링크";
  const [path, setPath] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const createLink = publicShare ? createTripShare : createInvite;
    void createLink(tripId, controller.signal).then(
      ({ token }) => {
        if (!controller.signal.aborted) {
          setPath(publicShare ? routes.sharedTrip.replace(":token", encodeURIComponent(token)) : invitePath(token));
        }
      },
      () => {
        if (!controller.signal.aborted) setLoadFailed(true);
      },
    );
    return () => controller.abort();
  }, [attempt, publicShare, tripId]);

  const link = path ? new URL(path, window.location.origin).href : "";

  async function shareLink(share: boolean) {
    setMessage("");
    setActionError("");
    try {
      if (share) await navigator.share({ title: `도틀로 ${title}`, url: link });
      else {
        await navigator.clipboard.writeText(link);
        setMessage(`${linkLabel}를 복사했어요.`);
      }
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setActionError("링크를 공유하지 못했어요. 링크를 직접 복사해 주세요.");
    }
  }

  return (
    <TripSheet title={title} onClose={onClose}>
      <S.InviteContent>
        <p>{publicShare ? "링크를 받은 사람은 로그인 없이 일정을 볼 수 있어요." : "링크를 받은 친구는 일정을 함께 볼 수 있어요."}</p>
        {loadFailed ? (
          <>
            <p role="alert">{linkLabel}를 만들지 못했어요.</p>
            <S.SheetPrimaryButton type="button" onClick={() => {
              setLoadFailed(false);
              setAttempt((value) => value + 1);
            }}>다시 시도</S.SheetPrimaryButton>
          </>
        ) : link ? (
          <>
            <S.LinkBox>
              <img src={linkIcon} alt="" />
              <span title={link}>{link}</span>
              <button type="button" onClick={() => void shareLink(false)}>링크 복사</button>
            </S.LinkBox>
            {typeof navigator.share === "function" && (
              <S.SheetPrimaryButton type="button" onClick={() => void shareLink(true)}>공유하기</S.SheetPrimaryButton>
            )}
            <Link to={path}>{publicShare ? "공개 일정 미리보기" : "초대장 미리보기"}</Link>
            {message && <p role="status">{message}</p>}
            {actionError && <p role="alert">{actionError}</p>}
          </>
        ) : <p role="status">{linkLabel}를 만들고 있어요.</p>}
      </S.InviteContent>
    </TripSheet>
  );
}

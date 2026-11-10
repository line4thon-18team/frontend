import { useMemo, useState } from "react";
import avatarBlue from "../../assets/course-settings/avatar-blue.png";
import heartIcon from "../../assets/figma/traveler-heart.svg";
import heartFilledIcon from "../../assets/figma/traveler-heart-filled.svg";
import { initialCompanionComments } from "../../data/mocks/courseCommunityData";
import type { CompanionComment } from "../../types/courseCommunity";
import "./CourseCommunity.css";

function CompanionOpinions() {
  const [comments, setComments] = useState<CompanionComment[]>(
    initialCompanionComments,
  );
  const [placeLiked, setPlaceLiked] = useState(true);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const placeLikes = useMemo(() => (placeLiked ? 1 : 0), [placeLiked]);

  const toggleCommentLike = (id: number) => {
    setComments((current) =>
      current.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.likes + (comment.liked ? -1 : 1),
            }
          : comment,
      ),
    );
  };

  const submitComment = () => {
    const nextMessage = message.trim();
    if (!nextMessage) return;

    setComments((current) => [
      ...current,
      {
        id: Date.now(),
        author: "우예빈",
        avatar: avatarBlue,
        message: nextMessage,
        time: "방금 전",
        likes: 0,
        liked: false,
        replyTo: replyTo ?? undefined,
      },
    ]);
    setMessage("");
    setReplyTo(null);
  };

  return (
    <section className="companion-opinions" aria-labelledby="companion-opinions-title">
      <header className="companion-opinions__header">
        <h2 id="companion-opinions-title">
          일행 의견 <span>{comments.length}</span>
        </h2>
        <button
          className={placeLiked ? "is-liked" : ""}
          type="button"
          aria-pressed={placeLiked}
          onClick={() => setPlaceLiked((current) => !current)}
        >
          <img src={placeLiked ? heartFilledIcon : heartIcon} alt="" /> 좋아요 {placeLikes}
        </button>
      </header>

      <div className="companion-opinions__thread">
        {comments.map((comment) => (
          <article
            className={comment.replyTo ? "companion-comment is-reply" : "companion-comment"}
            key={comment.id}
          >
            {comment.replyTo && <span className="companion-comment__thread-line" aria-hidden="true" />}
            <img src={comment.avatar} alt="" />
            <div>
              <p className="companion-comment__meta">
                <strong>{comment.author}</strong>
                <span>{comment.time}</span>
              </p>
              <p className="companion-comment__bubble">
                {comment.replyTo && <b>@{comment.replyTo} </b>}
                {comment.message}
              </p>
              <div className="companion-comment__actions">
                <button
                  className={comment.liked ? "is-liked" : ""}
                  type="button"
                  aria-label={`${comment.author}님의 의견 좋아요`}
                  aria-pressed={comment.liked}
                  onClick={() => toggleCommentLike(comment.id)}
                >
                  <img src={comment.liked ? heartFilledIcon : heartIcon} alt="" /> <span>{comment.likes}</span>
                </button>
                <button type="button" onClick={() => setReplyTo(comment.author)}>
                  답글 달기
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <form
        className="companion-composer"
        onSubmit={(event) => {
          event.preventDefault();
          submitComment();
        }}
      >
        <img src={avatarBlue} alt="" />
        <label>
          <span className="course-community__sr-only">일행에게 의견 남기기</span>
          <input
            value={message}
            placeholder={replyTo ? `@${replyTo}님에게 답글 남기기` : "일행에게 의견을 남겨보세요"}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit" disabled={!message.trim()} aria-label="의견 보내기">
            <span aria-hidden="true" />
          </button>
        </label>
      </form>
    </section>
  );
}

export default CompanionOpinions;

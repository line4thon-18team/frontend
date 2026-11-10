import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import backIcon from "../assets/icons/nav-back.svg";
import addPhotoIcon from "../assets/support/add-photo.svg";
import chevronDownIcon from "../assets/support/chevron-down.svg";
import chevronUpIcon from "../assets/support/chevron-up.svg";
import newDotIcon from "../assets/support/new-dot.svg";
import { routes } from "../config/routes";
import * as S from "./SupportPage.styled";

const notices = [
  { category: "업데이트", title: "도틀로 1.0 정식 출시 안내", date: "11월 8일", isNew: true, body: "도틀로 정식 버전이 출시됐어요. 저장한 장소를 모아 나만의 여행 코스를 만들어 보세요." },
  { category: "새 기능", title: "함께 계획하기에 투표 기능이 생겼어요", date: "11월 2일", isNew: true, body: "여행 멤버들과 장소를 제안하고 투표로 일정을 더 쉽게 정할 수 있어요." },
  { category: "점검", title: "Google Maps 연동 일시 점검 안내", date: "10월 28일", body: "안정적인 서비스 제공을 위해 Google Maps 연동 기능을 점검했어요." },
  { category: "안내", title: "개인정보 처리방침 개정 안내", date: "10월 20일", body: "개인정보 처리방침의 일부 내용이 변경되었어요." },
  { category: "안내", title: "추석 연휴 고객센터 운영 안내", date: "9월 30일", body: "연휴 중 접수된 의견은 순서대로 답변드릴게요." },
];

const faqItems = [
  { category: "Google Maps", question: "Google Maps 저장 장소는 어떻게 불러오나요?", answer: "마이 > Google Maps 연결하기를 누르고 구글 계정으로 로그인하면, 저장해 둔 목록 중 원하는 목록을 골라 불러올 수 있어요." },
  { category: "Google Maps", question: "불러온 장소가 보이지 않아요", answer: "연결한 구글 계정과 저장 목록을 확인한 뒤 다시 불러와 주세요. 이름 없는 핀은 장소 이름을 직접 검색해 선택할 수 있어요." },
  { category: "함께 계획", question: "친구와 함께 일정을 짜려면 어떻게 하나요?", answer: "코스 설정에서 친구 초대를 누른 뒤 초대 링크를 보내세요. 친구가 참여하면 함께 의견과 투표를 남길 수 있어요." },
  { category: "함께 계획", question: "AI가 만든 코스를 수정할 수 있나요?", answer: "장소 순서를 바꾸거나 다른 장소로 교체할 수 있고, AI에게 자연어로 수정 요청을 보낼 수도 있어요." },
  { category: "계정", question: "카카오 계정을 바꾸고 싶어요", answer: "계정 관리에서 로그아웃한 다음 바꾸려는 카카오 계정으로 다시 로그인해 주세요." },
];

function Header({ title }: { title: string }) {
  return (
    <S.Header>
      <Link to={routes.my} aria-label="마이 화면으로 돌아가기"><img src={backIcon} alt="" /></Link>
      <h1>{title}</h1>
    </S.Header>
  );
}

function HomeIndicator() {
  return <S.HomeIndicator aria-hidden="true" />;
}

function SupportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNotice, setOpenNotice] = useState<number | null>(null);
  const [category, setCategory] = useState("전체");
  const [openFaq, setOpenFaq] = useState(0);
  const [feedbackType, setFeedbackType] = useState("제안해요");
  const [message, setMessage] = useState("코스에 넣은 장소마다 메모를 남길 수 있으면 좋겠어요. 예약 번호 같은 걸 같이 적어두고 싶어요.");
  const [sent, setSent] = useState(false);

  const filteredFaq = useMemo(
    () => category === "전체" ? faqItems : faqItems.filter((item) => item.category === category),
    [category],
  );

  if (location.pathname === routes.notices) {
    return (
      <S.Page>
        <Header title="공지사항" />
        <S.NoticeList>
          {notices.map((notice, index) => (
            <li key={notice.title}>
              <button type="button" aria-expanded={openNotice === index} onClick={() => setOpenNotice(openNotice === index ? null : index)}>
                <span><b data-new={notice.isNew}>{notice.category}</b>{notice.isNew && <img src={newDotIcon} alt="새 글" />}</span>
                <strong>{notice.title}</strong>
                <small>{notice.date}</small>
              </button>
              {openNotice === index && <p>{notice.body}</p>}
            </li>
          ))}
        </S.NoticeList>
        <HomeIndicator />
      </S.Page>
    );
  }

  if (location.pathname === routes.faq) {
    return (
      <S.Page>
        <Header title="자주 묻는 질문" />
        <S.Categories>
          {["전체", "Google Maps", "함께 계획", "계정"].map((item) => (
            <button type="button" key={item} aria-pressed={category === item} onClick={() => { setCategory(item); setOpenFaq(0); }}>{item}</button>
          ))}
        </S.Categories>
        <S.FaqList>
          {filteredFaq.map((item, index) => (
            <li key={item.question}>
              <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                <b>Q</b><strong>{item.question}</strong><img src={openFaq === index ? chevronUpIcon : chevronDownIcon} alt="" />
              </button>
              {openFaq === index && <p>{item.answer}</p>}
            </li>
          ))}
        </S.FaqList>
        <S.Contact><span>찾는 답이 없나요?</span><Link to={routes.feedback}>도틀로에 의견 보내기</Link></S.Contact>
        <HomeIndicator />
      </S.Page>
    );
  }

  return (
    <S.Page>
      <Header title="의견 보내기" />
      <S.FeedbackForm onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
        <fieldset>
          <legend>어떤 이야기를 들려주실래요?</legend>
          <div>
            {["불편해요", "제안해요", "칭찬해요"].map((item) => (
              <button type="button" key={item} aria-pressed={feedbackType === item} onClick={() => setFeedbackType(item)}>{item}</button>
            ))}
          </div>
        </fieldset>
        <label htmlFor="feedback-message">내용</label>
        <S.MessageBox>
          <textarea id="feedback-message" maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} />
          <small>{message.length}/1000</small>
        </S.MessageBox>
        <strong>사진 첨부 (선택)</strong>
        <S.PhotoButton type="button" aria-label="사진 첨부"><img src={addPhotoIcon} alt="" /><span>0/3</span></S.PhotoButton>
        <S.Submit type="submit" disabled={!message.trim()}>보내기</S.Submit>
      </S.FeedbackForm>
      {sent && (
        <S.Overlay role="dialog" aria-modal="true">
          <div><h2>의견을 보내주셔서 감사해요</h2><p>더 좋은 도틀로를 만드는 데 소중히 참고할게요.</p><button type="button" onClick={() => navigate(routes.my)}>확인</button></div>
        </S.Overlay>
      )}
      <HomeIndicator />
    </S.Page>
  );
}

export default SupportPage;

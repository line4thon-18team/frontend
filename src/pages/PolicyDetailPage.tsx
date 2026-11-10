import { Link, useLocation, useNavigate, useParams } from "react-router";
import backIcon from "../assets/icons/nav-back.svg";
import { routes } from "../config/routes";
import { isPolicyDocumentId, policyDocuments } from "../data/policyDocuments";
import * as S from "./PolicyDetailPage.styled";

function PolicyDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { policyId } = useParams();
  const fromLogin = new URLSearchParams(location.search).get("from") === "login";

  if (!isPolicyDocumentId(policyId)) {
    return (
      <S.Page>
        <S.Header>
          <Link to={routes.accountSettings} aria-label="계정 관리로 돌아가기"><img src={backIcon} alt="" /></Link>
          <h1>약관과 개인정보</h1>
        </S.Header>
        <S.Missing><strong>문서를 찾을 수 없어요</strong><Link to={routes.accountSettings}>계정 관리로 돌아가기</Link></S.Missing>
      </S.Page>
    );
  }

  const document = policyDocuments[policyId];
  const goBack = () => navigate(fromLogin ? `${routes.login}?terms=1` : routes.accountSettings);

  return (
    <S.Page>
      <S.Header>
        <button type="button" aria-label={fromLogin ? "약관 동의로 돌아가기" : "계정 관리로 돌아가기"} onClick={goBack}><img src={backIcon} alt="" /></button>
        <h1>{document.title}</h1>
      </S.Header>
      <S.Document>
        <S.Intro>
          <strong>{document.summary}</strong>
          <span>시행일 {document.effectiveDate}</span>
        </S.Intro>
        {document.sections.map((section) => (
          <S.PolicySection key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          </S.PolicySection>
        ))}
        <S.Contact>문의가 필요하신가요?<Link to={routes.feedback}>도틀로에 의견 보내기</Link></S.Contact>
      </S.Document>
      <S.HomeIndicator />
    </S.Page>
  );
}

export default PolicyDetailPage;

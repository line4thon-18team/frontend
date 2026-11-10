import { useState } from "react";
import backIcon from "../../assets/figma/traveler-back.svg";
import heartIcon from "../../assets/figma/traveler-heart.svg";
import heartFilledIcon from "../../assets/figma/traveler-heart-filled.svg";
import { sannenzakaDetail } from "../../data/mocks/travelerCourseData";
import * as S from "./TravelerCourseOverlay.styled";

interface TravelerPlaceDetailProps {
  onBack: () => void;
}

function TravelerPlaceDetail({ onBack }: TravelerPlaceDetailProps) {
  const [saved, setSaved] = useState(true);
  const [notice, setNotice] = useState("");

  return (
    <S.PlaceScreen>
      <S.PlaceHero>
        <img src={sannenzakaDetail.hero} alt="산넨자카 골목" />
        <S.PlaceNavigation>
          <button type="button" aria-label="지도 화면으로 돌아가기" onClick={onBack}><img src={backIcon} alt="" /></button>
          <button type="button" aria-label={saved ? "장소 저장 해제" : "장소 저장"} onClick={() => setSaved((value) => !value)}><img src={saved ? heartFilledIcon : heartIcon} alt="" /></button>
        </S.PlaceNavigation>
        <S.GalleryIndicator>1 / {sannenzakaDetail.gallery.length}</S.GalleryIndicator>
      </S.PlaceHero>

      <S.PlaceBody>
        <S.PlaceTitle>
          <span>{sannenzakaDetail.category}</span>
          <h1>{sannenzakaDetail.name}</h1>
          <small>{sannenzakaDetail.englishName}</small>
          <p>★ {sannenzakaDetail.rating}　<span>{sannenzakaDetail.reviewCount}　|　{sannenzakaDetail.region}</span></p>
        </S.PlaceTitle>
        <section><h2>소개</h2><p>{sannenzakaDetail.description}</p></section>
        <section>
          <h2>기본 정보</h2>
          <S.InfoRows>
            <div><span>영업시간</span><strong>{sannenzakaDetail.hours}</strong><b>지금 영업 중</b></div>
            <div><span>주소</span><strong>{sannenzakaDetail.address}</strong><em>복사</em></div>
          </S.InfoRows>
        </section>
        <section><h2>위치</h2><S.LocationMap src={sannenzakaDetail.map} alt="산넨자카 골목 위치 지도" /></section>
      </S.PlaceBody>
      <S.AiButton type="button" onClick={() => setNotice("도틀로 AI 질문 화면은 다음 흐름에서 이어져요")}>✦　도틀로 AI에게 물어보기</S.AiButton>
      {notice && <div role="status" hidden>{notice}</div>}
    </S.PlaceScreen>
  );
}

export default TravelerPlaceDetail;


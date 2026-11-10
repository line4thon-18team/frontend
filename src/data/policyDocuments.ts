export type PolicyDocumentId = "service" | "privacy" | "location" | "marketing";

export interface PolicySection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PolicyDocument {
  id: PolicyDocumentId;
  title: string;
  effectiveDate: string;
  summary: string;
  sections: PolicySection[];
}

export const policyDocuments: Record<PolicyDocumentId, PolicyDocument> = {
  service: {
    id: "service",
    title: "서비스 이용약관",
    effectiveDate: "2026년 4월 2일",
    summary: "도틀로 서비스 이용에 필요한 기본 권리와 의무를 안내합니다.",
    sections: [
      { heading: "제1조 목적", paragraphs: ["이 약관은 도틀로가 제공하는 여행 일정 생성과 공유 서비스의 이용 조건 및 절차를 정하는 것을 목적으로 합니다."] },
      { heading: "제2조 서비스 이용", paragraphs: ["회원은 본인 계정으로 서비스를 이용하며, 생성하거나 공유한 여행 정보가 다른 사람의 권리를 침해하지 않도록 주의해야 합니다."], bullets: ["여행 장소 저장 및 일정 생성", "동행자 초대와 공동 편집", "여행 코스 저장·복제·공유"] },
      { heading: "제3조 회원의 의무", paragraphs: ["계정 정보는 정확하게 유지해야 하며, 타인의 계정을 사용하거나 서비스 운영을 방해해서는 안 됩니다."] },
      { heading: "제4조 서비스 변경", paragraphs: ["더 나은 서비스 제공을 위해 기능의 일부가 변경될 수 있습니다. 중요한 변경은 앱 내 공지사항을 통해 안내합니다."] },
      { heading: "제5조 문의", paragraphs: ["서비스 이용과 관련한 문의는 앱의 ‘의견 보내기’를 통해 접수할 수 있습니다."] },
    ],
  },
  privacy: {
    id: "privacy",
    title: "개인정보 처리방침",
    effectiveDate: "2026년 4월 2일",
    summary: "도틀로가 어떤 개인정보를 왜 수집하고 어떻게 보호하는지 안내합니다.",
    sections: [
      { heading: "1. 수집하는 정보", paragraphs: ["회원 가입과 서비스 제공 과정에서 필요한 최소한의 정보를 수집합니다."], bullets: ["소셜 로그인 식별자, 이메일, 닉네임", "여행 일정과 저장한 장소", "서비스 이용 기록 및 오류 기록"] },
      { heading: "2. 이용 목적", paragraphs: ["수집한 정보는 회원 식별, 여행 일정 생성, 동행자 협업, 고객 지원과 서비스 품질 개선에 사용합니다."] },
      { heading: "3. 보유 기간", paragraphs: ["회원 탈퇴 시 개인정보를 지체 없이 파기합니다. 다만 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 분리 보관합니다."] },
      { heading: "4. 외부 서비스 연동", paragraphs: ["Google Maps 연동은 사용자가 직접 선택하며 언제든 계정 관리에서 해제할 수 있습니다."] },
      { heading: "5. 이용자의 권리", paragraphs: ["회원은 자신의 개인정보를 조회·수정하거나 처리 정지와 삭제를 요청할 수 있습니다."] },
    ],
  },
  location: {
    id: "location",
    title: "위치기반 서비스 이용약관",
    effectiveDate: "2026년 4월 2일",
    summary: "여행 장소 검색과 이동 경로 안내에 위치 정보가 사용되는 방식을 안내합니다.",
    sections: [
      { heading: "제1조 목적", paragraphs: ["이 약관은 위치 정보를 활용한 장소 검색과 여행 경로 제공 기능의 이용 조건을 정합니다."] },
      { heading: "제2조 제공 기능", paragraphs: ["사용자가 허용한 경우 현재 위치를 기준으로 주변 장소와 이동 정보를 보여줍니다."], bullets: ["주변 여행 장소 검색", "장소 간 거리와 이동 시간 안내", "여행 일정의 지도 표시"] },
      { heading: "제3조 위치 정보 보호", paragraphs: ["위치 정보는 기능 제공에 필요한 범위에서만 사용하며, 사용자의 동의 없이 제3자에게 제공하지 않습니다."] },
      { heading: "제4조 이용 중지", paragraphs: ["기기 설정에서 위치 권한을 끄면 언제든 위치기반 기능의 이용을 중지할 수 있습니다."] },
    ],
  },
  marketing: {
    id: "marketing",
    title: "혜택 및 이벤트 알림 동의",
    effectiveDate: "2026년 4월 2일",
    summary: "새로운 여행 코스와 이벤트 소식을 받기 위한 선택 동의 항목입니다.",
    sections: [
      { heading: "수신 정보", paragraphs: ["도틀로의 새로운 기능, 추천 여행 코스, 이벤트와 혜택 정보를 앱 알림으로 보내드릴 수 있습니다."] },
      { heading: "선택 동의", paragraphs: ["이 항목에 동의하지 않아도 도틀로의 기본 기능을 이용할 수 있습니다."] },
      { heading: "동의 철회", paragraphs: ["마이 화면의 알림 설정에서 언제든 수신 여부를 변경할 수 있습니다."] },
    ],
  },
};

export const isPolicyDocumentId = (value: string | undefined): value is PolicyDocumentId =>
  Boolean(value && value in policyDocuments);

export const policyPath = (id: PolicyDocumentId, fromLogin = false) =>
  `/my/account/policies/${id}${fromLogin ? "?from=login" : ""}`;

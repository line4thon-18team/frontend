import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  width: 100%;
  max-width: 402px;
  min-height: 100dvh;
  margin: 0 auto;
  padding-bottom: 42px;
  color: #1a1a1a;
  background: #ffffff;
  font-family: "Noto Sans KR", Arial, sans-serif;

  a { color: inherit; text-decoration: none; }
  button { padding: 0; border: 0; color: inherit; background: transparent; cursor: pointer; }
`;

export const Header = styled.header`
  position: sticky;
  z-index: 3;
  top: 0;
  height: 54px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #f0f1f4;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);

  a,
  button { width: 22px; height: 40px; display: grid; place-items: center; }
  img { width: 10px; height: 18px; }
  h1 { min-width: 0; margin: 0; overflow: hidden; font-size: 17px; line-height: 24px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
`;

export const Document = styled.article`
  padding: 20px 20px 28px;
`;

export const Intro = styled.header`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 16px;
  background: #f3f5fa;

  strong { font-size: 15px; line-height: 23px; }
  span { color: #8a8a8e; font-size: 12px; line-height: 17px; }
`;

export const PolicySection = styled.section`
  padding: 26px 0;
  border-bottom: 1px solid #eceef2;

  h2 { margin: 0 0 12px; font-size: 16px; line-height: 24px; font-weight: 700; }
  p { margin: 0; color: #5c5c63; font-size: 14px; line-height: 23px; word-break: keep-all; }
  ul { margin: 14px 0 0; padding: 14px 18px 14px 34px; border-radius: 12px; background: #f8f9fb; }
  li { padding: 3px 0; color: #5c5c63; font-size: 13px; line-height: 20px; }
`;

export const Contact = styled.div`
  padding: 26px 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #8a8a8e;
  font-size: 13px;
  line-height: 18px;

  a { color: #4840c8; font-weight: 700; }
`;

export const HomeIndicator = styled.div`
  position: fixed;
  z-index: 4;
  right: 0;
  bottom: 8px;
  left: 0;
  width: 134px;
  height: 5px;
  margin: 0 auto;
  border-radius: 3px;
  background: #000000;
`;

export const Missing = styled.section`
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  strong { font-size: 17px; }
  a { padding: 12px 20px; border-radius: 99px; color: #ffffff; background: #090738; font-size: 14px; font-weight: 700; }
`;

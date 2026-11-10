import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  width: 100%;
  max-width: 402px;
  min-height: 100dvh;
  margin: 0 auto;
  padding-bottom: 36px;
  color: #1a1a1a;
  background: #ffffff;
  font-family: "Noto Sans KR", Arial, sans-serif;

  a { color: inherit; text-decoration: none; }
  button { margin: 0; padding: 0; border: 0; color: inherit; background: transparent; font: inherit; cursor: pointer; }
`;

export const Header = styled.header`
  height: 52px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;

  a { width: 22px; height: 40px; display: grid; place-items: center; }
  img { width: 8.11667px; height: 14.5333px; }
  h1 { margin: 0; font-size: 17px; line-height: 24px; letter-spacing: -0.085px; }
`;

export const NoticeList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li { border-bottom: 1px solid #e4e6ec; }
  li > button { width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 18px 20px; text-align: left; }
  li > button > span { display: flex; align-items: center; gap: 6px; }
  li > button > span img { width: 5px; height: 5px; }
  li > button b { color: #8a8a8e; font-size: 12px; line-height: 17px; }
  li > button b[data-new="true"] { color: #0079c2; }
  li > button strong { font-size: 15px; line-height: 22px; font-weight: 500; }
  li > button small { color: #8a8a8e; font-size: 12px; line-height: 17px; }
  li > p { margin: -4px 0 0; padding: 0 20px 18px; color: #5c5c63; font-size: 14px; line-height: 22px; }
`;

export const Categories = styled.nav`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 20px;
  scrollbar-width: none;

  button { flex: 0 0 auto; padding: 6px 14px; border-radius: 18px; background: #f3f5fa; font-size: 13px; line-height: 18px; font-weight: 500; }
  button[aria-pressed="true"] { color: #ffffff; background: #090738; }
`;

export const FaqList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li { border-bottom: 1px solid #e4e6ec; }
  li > button { width: 100%; min-height: 58px; display: grid; grid-template-columns: 12px 1fr 16px; gap: 12px; align-items: center; padding: 18px 20px; text-align: left; }
  li > button b { color: #0079c2; font-size: 15px; line-height: 22px; }
  li > button strong { font-size: 15px; line-height: 22px; font-weight: 500; }
  li > button[aria-expanded="true"] strong { font-weight: 700; }
  li > button img { width: 16px; height: 16px; }
  li > p { margin: 0; padding: 16px 20px; color: #5c5c63; background: #f3f5fa; font-size: 14px; line-height: 20px; }
`;

export const Contact = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-top: 28px;

  span { color: #8a8a8e; font-size: 13px; line-height: 18px; }
  a { color: #090738; font-size: 14px; line-height: 20px; font-weight: 700; }
`;

export const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px 20px 124px;

  fieldset { margin: 0 0 24px; padding: 0; border: 0; }
  legend, > label, > strong { display: block; margin: 0 0 10px; font-size: 15px; line-height: 22px; font-weight: 700; }
  fieldset > div { display: flex; gap: 8px; }
  fieldset button { padding: 9px 16px; border: 1px solid #e4e6ec; border-radius: 20px; font-size: 14px; line-height: 20px; }
  fieldset button[aria-pressed="true"] { border-color: #090738; color: #ffffff; background: #090738; }
  > strong { margin-top: 24px; }
`;

export const MessageBox = styled.div`
  position: relative;
  height: 166px;
  border: 1.5px solid #090738;
  border-radius: 14px;

  textarea { width: 100%; height: 124px; resize: none; padding: 15px 16px; border: 0; outline: 0; color: #1a1a1a; background: transparent; font-size: 15px; line-height: 22px; }
  small { position: absolute; right: 16px; bottom: 13px; color: #8a8a8e; font-size: 12px; line-height: 17px; }
`;

export const PhotoButton = styled.button`
  width: 72px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px dashed #e4e6ec !important;
  border-radius: 12px;

  img { width: 22px; height: 22px; }
  span { color: #8a8a8e; font-size: 11px; line-height: 15px; }
`;

export const Submit = styled.button`
  position: fixed;
  right: max(calc((100vw - 402px) / 2 + 20px), 20px);
  bottom: 42px;
  left: max(calc((100vw - 402px) / 2 + 20px), 20px);
  max-width: 362px;
  height: 56px;
  margin: auto !important;
  border-radius: 14px !important;
  color: #ffffff !important;
  background: #090738 !important;
  text-align: center !important;
  font-size: 16px !important;
  line-height: 22px !important;
  font-weight: 700 !important;

  &:disabled { background: #d1d1d6 !important; }
`;

export const Overlay = styled.div`
  position: fixed;
  z-index: 12;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(10,10,26,.45);

  > div { width: min(calc(100% - 48px), 354px); padding: 28px 24px 20px; border-radius: 24px; background: #ffffff; text-align: center; }
  h2 { margin: 0; font-size: 20px; line-height: 28px; }
  p { margin: 8px 0 24px; color: #5c5c63; font-size: 14px; line-height: 20px; }
  button { width: 100%; height: 50px; border-radius: 14px; color: #ffffff; background: #090738; text-align: center; font-weight: 700; }
`;

export const HomeIndicator = styled.div`
  position: fixed;
  z-index: 14;
  right: 0;
  bottom: 8px;
  left: 0;
  width: 134px;
  height: 5px;
  margin: auto;
  border-radius: 3px;
  background: #000000;
`;

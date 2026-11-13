import styled from "styled-components";

export const Page = styled.div`
  width: 100%; max-width: 402px; min-height: 100dvh; margin: 0 auto; color: #1a1a1a; background: #ffffff; font-family: "Noto Sans KR", Arial, sans-serif;
  button, textarea { font: inherit; }
  :where(&) :where(button) { padding: 0; border: 0; color: inherit; background: transparent; cursor: pointer; }
`;
export const Header = styled.header`
  height: 54px; display: flex; align-items: center; gap: 14px; padding: 0 20px;
  button { width: 22px; height: 40px; display: grid; place-items: center; }
  img { width: 10px; height: 18px; }
  h1 { margin: 0; font-size: 17px; line-height: 24px; }
`;
const bodyBase = `padding: 20px 20px 140px; h2 { margin: 0; font-size: 24px; line-height: 32px; letter-spacing: -0.24px; } > p { margin: 8px 0 0; color: #5c5c63; font-size: 14px; line-height: 20px; }`;
export const NoticeBody = styled.main`${bodyBase}`;
export const ReasonBody = styled.main`${bodyBase}`;
export const Retry = styled.button`
  margin-top: 12px;
  min-height: 44px;
  color: #090738;
  text-decoration: underline;
`;
export const LostList = styled.ul`
  display: flex; flex-direction: column; gap: 8px; margin: 28px 0 34px; padding: 0; list-style: none;
  li { min-height: 56px; display: flex; align-items: center; gap: 14px; }
  li > span { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; background: #f3f5fa; }
  li img { width: 24px; height: 24px; object-fit: contain; }
  li div { display: flex; flex-direction: column; gap: 2px; }
  strong { font-size: 15px; line-height: 22px; }
  small { color: #8a8a8e; font-size: 12px; line-height: 17px; }
`;
export const Footnote = styled.p`
  color: #8a8a8e !important; font-size: 12px !important; line-height: 17px !important;
`;
export const Agree = styled.div`
  display: flex; align-items: center; gap: 10px; margin-top: 24px;
  button { width: 22px; height: 22px; display: grid; place-items: center; border: 1.5px solid #e4e6ec; border-radius: 6px; color: #ffffff; font-weight: 700; }
  button[aria-checked="true"] { border-color: #090738; background: #090738; }
  span { font-size: 14px; line-height: 20px; }
`;
export const Reasons = styled.div`
  display: flex; flex-direction: column; margin-top: 16px;
  label { min-height: 50px; display: flex; align-items: center; gap: 12px; font-size: 15px; line-height: 22px; }
  input { position: absolute; opacity: 0; pointer-events: none; }
  label > span { width: 22px; height: 22px; border: 1.5px solid #e4e6ec; border-radius: 50%; }
  input:checked + span { border: 7px solid #090738; }
  input:checked ~ * { font-weight: 700; }
`;
export const Textarea = styled.div`
  display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; border: 1.5px solid #090738; border-radius: 12px;
  textarea { min-height: 44px; padding: 0; resize: none; border: 0; outline: 0; color: #1a1a1a; font-size: 15px; line-height: 22px; }
  span { color: #8a8a8e; font-size: 12px; line-height: 17px; text-align: right; }
`;
export const Cta = styled.footer`
  position: fixed; z-index: 3; right: 0; bottom: 0; left: 0; width: min(100%, 402px); margin: auto; padding: 12px 20px 0; background: #ffffff;
  > button { width: 100%; min-height: 56px; border-radius: 14px; color: #ffffff; background: #090738; text-align: center; font-size: 16px; font-weight: 700; }
  > button:disabled { background: #e4e6ec; cursor: default; }
`;
export const HomeIndicator = styled.div`width: 134px; height: 5px; margin: 18px auto 8px; border-radius: 3px; background: #000000;`;
export const Overlay = styled.div`position: fixed; z-index: 10; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.5);`;
export const Dialog = styled.div`
  width: min(calc(100% - 80px), 322px); padding: 28px 24px 20px; border-radius: 24px; background: #ffffff; text-align: center;
  > strong { font-size: 18px; line-height: 25px; }
  > p { margin: 8px 0 24px; color: #5c5c63; font-size: 14px; line-height: 20px; }
  > div { display: flex; gap: 8px; }
  button { min-height: 52px; flex: 1; border-radius: 14px; background: #f3f5fa; font-weight: 700; }
  button[data-danger] { color: #ffffff; background: #e5484d; }
  button:disabled { opacity: 0.65; cursor: default; }
`;
export const Done = styled.main`
  display: flex; flex-direction: column; align-items: center; padding: 170px 20px 130px; text-align: center;
  h1 { margin: 28px 0 8px; font-size: 24px; line-height: 32px; }
  p { margin: 0; color: #5c5c63; font-size: 15px; line-height: 22px; }
`;
export const DoneAvatar = styled.div`
  width: 120px; height: 120px; display: grid; place-items: center; border-radius: 50%; background: #ddf9fd;
  img { width: 98px; height: 98px; object-fit: contain; }
`;

import styled, { keyframes } from "styled-components";

export const Page = styled.div`
  width: 100%;
  max-width: 402px;
  min-height: 100dvh;
  margin: 0 auto;
  padding-bottom: 34px;
  color: #1a1a1a;
  background: #ffffff;
  font-family: "Noto Sans KR", Arial, sans-serif;

  a { color: inherit; text-decoration: none; }
  button { padding: 0; border: 0; color: inherit; background: transparent; font: inherit; cursor: pointer; }
`;

export const Header = styled.header`
  height: 54px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;

  a { width: 22px; height: 40px; display: grid; place-items: center; }
  img { width: 10px; height: 18px; }
  h1 { margin: 0; font-size: 17px; line-height: 24px; font-weight: 700; }
`;

export const AccountCard = styled.section`
  min-height: 96px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px 20px;

  > span { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 6px; }
  strong { overflow: hidden; font-size: 15px; line-height: 22px; text-overflow: ellipsis; white-space: nowrap; }
  small { display: flex; align-items: center; gap: 5px; color: #5c5c63; font-size: 11px; line-height: 15px; }
  small i { width: 12px; height: 12px; border: 3px solid #fee500; border-radius: 50%; background: #1a1a1a; }
  small b { margin-left: 6px; color: #8a8a8e; font-weight: 400; }
`;

export const Avatar = styled.span`
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ddf9fd;

  img { width: 42px; height: 42px; object-fit: contain; }
`;

export const Band = styled.div`
  height: 8px;
  background: #f3f5fa;
`;

export const Section = styled.section`
  padding: 20px 20px 4px;

  h2 { margin: 0 0 12px; color: #8a8a8e; font-size: 13px; line-height: 18px; font-weight: 700; }
`;

export const ServiceRow = styled.div`
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 12px;

  > span { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
  > span strong { font-size: 15px; line-height: 22px; }
  > span small { display: flex; align-items: center; gap: 5px; color: #8a8a8e; font-size: 12px; line-height: 17px; }
  > span small i { width: 6px; height: 6px; border-radius: 50%; background: #e4e6ec; }
  > span small i[data-linked="true"] { background: #00c7df; }
  > a, > button { padding: 7px 14px; border: 1px solid #e4e6ec; border-radius: 16px; font-size: 13px; line-height: 18px; font-weight: 700; }
`;

export const ServiceLogo = styled.span`
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid #e4e6ec;
  border-radius: 12px;

  img { width: 24px; height: 24px; object-fit: contain; }
`;

export const PolicyButton = styled.button`
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px !important;
  line-height: 22px !important;
  font-weight: 500 !important;

  img { width: 16px; height: 16px; }
`;

export const AccountActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 28px;
  color: #5c5c63;
  font-size: 14px;
  line-height: 20px;

  i { width: 1px; height: 12px; background: #e4e6ec; }
  a { color: #8a8a8e; }
`;

export const HomeIndicator = styled.div`
  position: fixed;
  right: 0;
  bottom: 8px;
  left: 0;
  width: 134px;
  height: 5px;
  margin: 0 auto;
  border-radius: 3px;
  background: #000000;
`;

export const Overlay = styled.div`
  position: fixed;
  z-index: 10;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
`;

export const Dialog = styled.div`
  width: min(calc(100% - 80px), 322px);
  padding: 28px 24px 20px;
  border-radius: 24px;
  background: #ffffff;
  text-align: center;

  > strong { font-size: 18px; line-height: 25px; }
  > p { margin: 8px 0 24px; color: #5c5c63; font-size: 14px; line-height: 20px; }
  > div { display: flex; gap: 8px; }
  button { min-height: 52px; flex: 1; border-radius: 14px; background: #f3f5fa; text-align: center; font-weight: 700; }
  button[data-primary] { color: #ffffff; background: #090738; }
`;

const toastIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

export const Toast = styled.div`
  position: fixed;
  right: 20px;
  bottom: 52px;
  left: 20px;
  width: min(calc(100% - 40px), 362px);
  margin: auto;
  padding: 14px 16px;
  border-radius: 12px;
  color: #ffffff;
  background: #090738;
  text-align: center;
  font-size: 13px;
  animation: ${toastIn} 0.2s ease;
`;

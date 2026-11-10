import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  width: 100%;
  max-width: 402px;
  min-height: 874px;
  margin: 0 auto;
  overflow: hidden;
  color: #1a1a1a;
  background: #f3f5fa;
  font-family: "Noto Sans KR", Arial, sans-serif;

  button {
    margin: 0;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    font: inherit;
    cursor: pointer;
  }
`;

export const Hero = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 470px;

  > img { width: 100%; height: 100%; object-fit: cover; }
`;

export const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10,10,31,.4) 0%, rgba(10,10,31,.08) 30%, rgba(10,10,31,.3) 55%, rgba(10,10,31,.78) 100%);
`;

export const Fade = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(243,245,250,0), #f3f5fa);
`;

export const InviterPill = styled.div`
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 6px;
  border: 1px solid #ffffff;
  border-radius: 20px;
  color: #ffffff;
  background: rgba(255,255,255,.22);
  backdrop-filter: blur(8px);
  white-space: nowrap;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;

  strong { font-weight: 700; }
`;

export const InviterAvatar = styled.span`
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #ddf7ff;

  img { width: 21px; height: 21px; border-radius: 50%; object-fit: cover; }
`;

export const Ticket = styled.section`
  position: absolute;
  top: 297px;
  left: 50%;
  width: 362px;
  min-height: 404px;
  transform: translateX(-50%);

  > .ticket-shape {
    position: absolute;
    z-index: 0;
    inset: -20px -32px -44px;
    width: 426px;
    height: 469px;
  }

  > *:not(.ticket-shape) { position: relative; z-index: 1; }
`;

export const TicketTop = styled.div`
  padding: 24px 24px 22px;

  .dotlo-mark { width: 86px; height: 16px; object-fit: contain; object-position: left; }
  h1 { margin: 12px 0 2px; font-size: 28px; line-height: 36px; letter-spacing: -0.28px; }
  > p { margin: 0; color: #5c5c63; font-size: 14px; line-height: 20px; }
`;

export const TripInfo = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 22px;

  > div {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  span {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }

  span[data-tone="sky"] { background: #ddf7ff; }
  span[data-tone="purple"] { background: #efedff; }
  span[data-tone="yellow"] { background: #fff8d6; }
  img { width: 20px; height: 20px; }
  small { margin-top: 10px; color: #8a8a8e; font-size: 11px; line-height: 15px; font-weight: 500; }
  strong { font-size: 14px; line-height: 20px; }
`;

export const Perforation = styled.div`
  height: 22px;
  display: flex;
  align-items: center;
  padding: 0 26px;

  img { width: 310px; height: 3px; }
`;

export const TicketBottom = styled.div`
  padding: 16px 24px 24px;

  h2 { margin: 0 0 12px; font-size: 14px; line-height: 20px; }
  h2 b { color: #0079c2; }
`;

export const Thumbs = styled.div`
  display: flex;
  gap: 8px;

  > img, > span { width: 72.5px; height: 72.5px; flex: 0 0 auto; border-radius: 12px; object-fit: cover; }
  > span { position: relative; overflow: hidden; background: #090738; }
  > span img { width: 100%; height: 100%; object-fit: cover; opacity: .08; }
  > span b { position: absolute; inset: 0; display: grid; place-items: center; color: #ffffff; font-size: 16px; }
`;

export const Actions = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px 34px;
  background: #f3f5fa;

  > button:first-of-type {
    width: 100%;
    height: 56px;
    border-radius: 16px;
    color: #ffffff;
    background: #090738;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    font-weight: 700;
  }
`;

export const LaterButton = styled.button`
  width: 100%;
  height: 36px;
  color: #8a8a8e !important;
  text-align: center !important;
  font-size: 14px !important;
  line-height: 20px !important;
  font-weight: 500 !important;
`;

export const DisabledNotice = styled.p`
  margin: 0 0 10px;
  color: #e5484d;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
`;

export const HomeIndicator = styled.div`
  position: absolute;
  right: 0;
  bottom: 8px;
  left: 0;
  width: 134px;
  height: 5px;
  margin: auto;
  border-radius: 3px;
  background: #000000;
`;

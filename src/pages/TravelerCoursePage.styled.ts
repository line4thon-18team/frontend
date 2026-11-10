import styled from "styled-components";

export const Shell = styled.main`
  width: 100%;
  max-width: 402px;
  min-height: 100dvh;
  margin: 0 auto;
  overflow-x: hidden;
  background: #fff;
  color: #1a1a1a;
  font-family: "Noto Sans KR", Arial, sans-serif;
`;

export const Hero = styled.header`
  position: relative;
  height: 354px;
  color: #fff;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 180px;
    background: linear-gradient(rgba(10, 10, 26, 0.6), transparent);
    pointer-events: none;
  }
`;

export const Navigation = styled.nav`
  position: absolute;
  z-index: 2;
  top: env(safe-area-inset-top);
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 22px 1fr 24px;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;

  button {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border: 0;
    padding: 0;
    color: #fff;
    background: transparent;
    cursor: pointer;
  }

  button:first-child img {
    display: block;
    width: 8.11667px;
    height: 14.5333px;
  }

  strong {
    font-size: 17px;
  }
`;

export const Heart = styled.button<{ $saved: boolean }>`
  width: 20px !important;
  height: 20px !important;

  img {
    display: block;
    width: 20px;
    height: 20px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 22px 20px 28px;
`;

export const Intro = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h1 {
    margin: 0;
    white-space: pre-line;
    font-size: 26px;
    line-height: 35px;
    letter-spacing: -0.26px;
  }

  > p {
    margin: 0;
    color: #5c5c63;
    font-size: 14px;
    line-height: 20px;
  }
`;

export const Tags = styled.div`
  display: flex;
  gap: 6px;

  span {
    padding: 4px 9px;
    border-radius: 8px;
    color: #6b6bcc;
    background: #efedff;
    font-size: 11px;
    line-height: 15px;
    font-weight: 700;
  }
`;

export const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 14px;
    line-height: 20px;
  }

  small {
    color: #8a8a8e;
    font-size: 12px;
    line-height: 17px;
  }
`;

export const Facts = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 16px 8px;
  border-radius: 16px;
  background: #f3f5fa;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
  }

  strong {
    margin-top: 4px;
    font-size: 15px;
    line-height: 22px;
  }

  span {
    color: #8a8a8e;
    font-size: 12px;
    line-height: 17px;
  }
`;

export const Days = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 18px;
    line-height: 25px;
  }

  span {
    color: #8a8a8e;
    font-size: 12px;
  }
`;

export const DayTabs = styled.div`
  display: flex;
  gap: 22px;
  border-bottom: 1px solid #e4e6ec;

  button {
    border: 0;
    padding: 6px 0 10px;
    border-bottom: 2px solid transparent;
    color: #8a8a8e;
    background: transparent;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  }

  button[aria-selected="true"] {
    border-color: #1a1a1a;
    color: #1a1a1a;
    font-weight: 700;
  }
`;

export const MapPreview = styled.button`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 16px;
  background: #eef2f5;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    position: absolute;
    right: 12px;
    bottom: 12px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(9, 7, 56, 0.88);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const PlaceList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PlaceRow = styled.div`
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 12px;
`;

export const Rail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  b {
    display: grid;
    flex: 0 0 26px;
    width: 26px;
    height: 26px;
    place-items: center;
    border-radius: 50%;
    background: #00e1ff;
    color: #090738;
    font-size: 12px;
  }

  i {
    width: 2px;
    flex: 1;
    background: #d1d1d6;
  }
`;

export const PlaceContent = styled.div`
  min-width: 0;
`;

export const PlaceCard = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e4e6ec;
  border-radius: 16px;
  background: #fff;
  text-align: left;
  cursor: pointer;

  img {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    object-fit: cover;
  }

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 15px;
    line-height: 22px;
  }

  small {
    margin-top: 4px;
    color: #8a8a8e;
    font-size: 12px;
  }
`;

export const Move = styled.p`
  margin: 0;
  padding: 10px 4px;
  color: #5c5c63;
  font-size: 12px;
  font-weight: 700;

  display: flex;
  align-items: center;
  gap: 5px;

  > img {
    width: 14px;
    height: 14px;
  }

  span {
    margin-left: 1px;
    padding-left: 7px;
    border-left: 1px solid #d1d1d6;
    color: #8a8a8e;
    font-weight: 500;
  }
`;

export const Cta = styled.div`
  position: sticky;
  z-index: 4;
  bottom: 0;
  padding: 12px 20px 34px;
  border-top: 1px solid #e4e6ec;
  background: #fff;

  button {
    width: 100%;
    height: 54px;
    border: 0;
    border-radius: 16px;
    color: #fff;
    background: #090738;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }
`;

export const Toast = styled.div`
  position: fixed;
  z-index: 6;
  left: 50%;
  bottom: 114px;
  width: min(calc(100% - 40px), 362px);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 18px;
  border-radius: 16px;
  color: #fff;
  background: rgba(24, 24, 26, 0.94);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-size: 14px;

  b {
    color: #00e1ff;
  }
`;


import styled from "styled-components";

export const FullScreen = styled.main`
  width: 100%;
  max-width: 402px;
  min-height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  color: #1a1a1a;
  font-family: "Noto Sans KR", Arial, sans-serif;
`;

export const MapScreen = styled(FullScreen)`
  position: relative;
  height: 100dvh;
`;

export const MapHeader = styled.header`
  height: 100px;
  padding: 8px 20px 12px;
  background: #fff;

  > div:first-child {
    display: grid;
    grid-template-columns: 28px 1fr 28px;
    align-items: center;
    min-height: 38px;
  }

  h1 {
    margin: 0;
    text-align: center;
    font-size: 17px;
  }

  button {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;

    img {
      width: 10px;
      height: 18px;
    }
  }
`;

export const MapTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;

  button {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    min-width: 54px;
    height: 34px;
    padding: 0 15px;
    border: 1px solid #e4e6ec;
    border-radius: 17px;
    background: #fff;
    color: #5c5c63;
    font-size: 13px;
  }

  button[aria-pressed="true"] {
    border-color: #090738;
    background: #090738;
    color: #fff;
    font-weight: 700;
  }
`;

export const MapCanvas = styled.div`
  position: absolute;
  top: 100px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background: #e7edf0;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }
`;

export const MapPin = styled.button<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #00d7f2;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 140, 178, 0.28);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const DaySheet = styled.section`
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  height: 340px;
  overflow-y: auto;
  padding: 28px 20px 32px;
  border-radius: 28px 28px 0 0;
  background: #fff;
  box-shadow: 0 -6px 24px rgba(16, 16, 40, 0.14);
  scrollbar-width: none;

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 50%;
    width: 38px;
    height: 4px;
    transform: translateX(-50%);
    border-radius: 4px;
    background: #d1d1d6;
  }

  h2 {
    margin: 0 0 4px;
    font-size: 20px;
  }

  > p {
    margin: 0 0 16px;
    color: #8a8a8e;
    font-size: 12px;
  }
`;

export const MapPlaceRow = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 26px 58px 1fr;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;

  b:first-child {
    display: grid;
    width: 26px;
    height: 26px;
    place-items: center;
    border-radius: 50%;
    background: #00e1ff;
    color: #090738;
    font-size: 12px;
  }

  img {
    width: 58px;
    height: 58px;
    border-radius: 12px;
    object-fit: cover;
  }

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 15px;
  }

  small {
    margin-top: 5px;
    color: #8a8a8e;
    font-size: 12px;
  }
`;

export const PlaceScreen = styled(FullScreen)`
  position: relative;
  padding-bottom: 96px;
`;

export const PlaceHero = styled.header`
  position: relative;
  height: 362px;
  color: #fff;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 150px;
    background: linear-gradient(rgba(10, 10, 26, 0.55), transparent);
  }
`;

export const PlaceNavigation = styled.div`
  position: absolute;
  z-index: 3;
  top: env(safe-area-inset-top);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 20px;

  button {
    border: 0;
    color: #fff;
    background: transparent;
    cursor: pointer;

    img {
      display: block;
      max-width: 20px;
      max-height: 20px;
    }
  }

`;

export const GalleryIndicator = styled.div`
  position: absolute;
  z-index: 2;
  right: 18px;
  bottom: 14px;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
`;

export const PlaceBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px 20px 40px;

  section h2 {
    margin: 0 0 14px;
    font-size: 18px;
  }

  section p {
    margin: 0;
    color: #5c5c63;
    font-size: 14px;
    line-height: 22px;
  }
`;

export const PlaceTitle = styled.section`
  > span {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 7px;
    color: #5c5c63;
    background: #f3f5fa;
    font-size: 11px;
  }

  h1 {
    margin: 10px 0 2px;
    font-size: 26px;
    line-height: 35px;
  }

  > small {
    color: #8a8a8e;
    font-size: 14px;
  }

  > p {
    margin-top: 12px !important;
    color: #1a1a1a !important;
    font-weight: 700;

    span {
      color: #8a8a8e;
      font-weight: 400;
    }
  }
`;

export const InfoRows = styled.div`
  display: flex;
  flex-direction: column;

  div {
    display: grid;
    grid-template-columns: 76px 1fr auto;
    gap: 0;
    padding: 14px 0;
    border-bottom: 1px solid #e4e6ec;
    font-size: 13px;
  }

  span {
    color: #8a8a8e;
  }

  b {
    color: #27ae60;
    font-size: 12px;
  }
`;

export const LocationMap = styled.img`
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: 16px;
`;

export const AiButton = styled.button`
  position: fixed;
  z-index: 4;
  right: max(20px, calc((100vw - 402px) / 2 + 20px));
  bottom: 24px;
  height: 52px;
  padding: 0 22px;
  border: 0;
  border-radius: 26px;
  background: #00e1ff;
  color: #090738;
  box-shadow: 0 8px 24px rgba(0, 139, 176, 0.28);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;


import styled from "styled-components";

const navy = "#12103f";
const muted = "#8b8d98";
const border = "#e7e8ee";

export const Shell = styled.div`
  position: relative;
  width: 100%;
  max-width: 402px;
  min-height: 100dvh;
  height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  color: #171722;
  background: #ffffff;
  font-family: "Noto Sans KR", Arial, sans-serif;

  :where(button) {
    margin: 0;
    padding: 0;
    border: 0;
    color: inherit;
    background: none;
    font: inherit;
    cursor: pointer;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export const PlainScreen = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

export const PlanScreen = styled(PlainScreen)`
  background: #f6f6fa;
`;

export const SearchScreen = styled(PlainScreen)``;

export const PlainHeader = styled.header`
  position: relative;
  height: 54px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #f1f1f4;

  h1 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    color: ${navy};
    font-size: 17px;
    line-height: 24px;
    font-weight: 700;
    white-space: nowrap;
  }
`;

export const BackButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;

  > img {
    display: block;
    width: 8.11667px;
    height: 14.5333px;
  }

  &:hover {
    background: rgb(255 255 255 / 15%);
  }
`;

export const InfoScroll = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 34px 20px 132px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const InfoIntro = styled.section`
  position: relative;
  padding: 8px 2px 35px;
  border-bottom: 1px solid ${border};

  > p {
    margin: 0 0 11px;
    color: ${muted};
    font-size: 14px;
  }

  h2 {
    margin: 0;
    color: #31313a;
    font-size: 23px;
    line-height: 1.65;
    font-weight: 500;
    letter-spacing: -0.7px;
  }

  h2 strong {
    color: ${navy};
    font-weight: 700;
    box-shadow: inset 0 -9px 0 #dff8fb;
  }

  button {
    position: absolute;
    right: 0;
    bottom: 13px;
    padding: 6px 9px;
    border-radius: 8px;
    color: #676975;
    background: #f3f3f7;
    font-size: 12px;
  }
`;

export const InfoSection = styled.section`
  padding-top: 30px;

  h3 {
    margin: 0;
    font-size: 17px;
    line-height: 25px;
  }

  > p {
    margin: 7px 0 18px;
    color: ${muted};
    font-size: 12px;
    line-height: 18px;
  }
`;

export const OptionalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  button {
    min-height: 128px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px 12px;
    border: 1px solid ${border};
    border-radius: 16px;
    background: #fbfbfd;
  }

  span {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    margin-bottom: 17px;
    border-radius: 11px;
    color: ${navy};
    background: #ebeaff;
    font-size: 17px;

    img {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }
  }

  strong {
    font-size: 14px;
    line-height: 21px;
  }

  small {
    margin-top: 2px;
    color: ${muted};
    font-size: 10px;
  }
`;

export const BottomAction = styled.div<{ $floating?: boolean }>`
  position: ${({ $floating }) => ($floating ? "absolute" : "relative")};
  z-index: 12;
  right: ${({ $floating }) => ($floating ? "0" : "auto")};
  bottom: ${({ $floating }) => ($floating ? "0" : "auto")};
  left: ${({ $floating }) => ($floating ? "0" : "auto")};
  flex: 0 0 auto;
  padding: 12px 20px max(22px, env(safe-area-inset-bottom));
  border-top: 1px solid #ededf2;
  background: rgb(255 255 255 / 96%);
  backdrop-filter: blur(10px);

  button {
    width: 100%;
    height: 54px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    color: #ffffff;
    background: ${navy};
    font-size: 16px;
    font-weight: 700;
    text-align: center;
  }

  button:disabled {
    color: #a6a7af;
    background: #e7e7ec;
    cursor: not-allowed;
  }
`;

export const Hero = styled.section`
  position: relative;
  height: 232px;
  flex: 0 0 auto;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HeroScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(5 5 31 / 60%) 0%, rgb(5 5 31 / 12%) 46%, rgb(5 5 31 / 72%) 100%);
`;

export const HeroHeader = styled.header`
  position: absolute;
  z-index: 5;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: end;
  gap: 6px;
  padding: 0 14px 22px;
  color: #ffffff;

  > div {
    min-width: 0;
  }

  small {
    display: block;
    margin-bottom: 3px;
    font-size: 11px;
  }

  h1 {
    margin: 0;
    font-size: 22px;
    line-height: 30px;
  }

  p {
    margin: 3px 0 0;
    font-size: 12px;
  }

  > button:last-child {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    justify-self: end;
    border-radius: 50%;
    background: rgb(255 255 255 / 20%);
  }

  > button:last-child img {
    width: 20px;
    filter: brightness(0) invert(1);
  }
`;

export const PlanScroll = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 100px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TripSummary = styled.section`
  display: grid;
  grid-template-columns: 1fr 1px 1fr 1px 1fr;
  align-items: center;
  margin: 14px 16px 12px;
  padding: 15px 10px;
  border: 1px solid #ececf1;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgb(17 16 63 / 5%);

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }

  span {
    color: ${muted};
    font-size: 10px;
  }

  strong {
    font-size: 13px;
  }

  i {
    width: 1px;
    height: 24px;
    background: ${border};
  }
`;

export const DayTabs = styled.nav`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 16px;
  padding: 4px;
  border-radius: 15px;
  background: #ffffff;

  button {
    position: relative;
    min-height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    border-radius: 12px;
    color: ${muted};
  }

  button[aria-pressed="true"] {
    color: #ffffff;
    background: ${navy};
  }

  strong {
    font-size: 12px;
  }

  span {
    font-size: 10px;
  }

  i {
    position: absolute;
    right: 10px;
    top: 8px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #62d8ea;
  }
`;

export const EmptyPlan = styled.section`
  min-height: 345px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 12px 16px 0;
  padding: 30px 24px;
  border-radius: 20px;
  background: #ffffff;
  text-align: center;

  > img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  h2 {
    margin: 13px 0 5px;
    color: ${navy};
    font-size: 17px;
  }

  p {
    margin: 0;
    color: ${muted};
    font-size: 12px;
    line-height: 19px;
  }

  button {
    height: 46px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 22px;
    padding: 0 18px;
    border: 1px solid #d9d9e3;
    border-radius: 12px;
    color: ${navy};
    background: #ffffff;
    font-size: 13px;
    font-weight: 700;
  }

  button img {
    width: 17px;
    filter: brightness(0) saturate(100%) invert(9%) sepia(31%) saturate(2463%) hue-rotate(213deg) brightness(80%);
  }
`;

export const FilledPlan = styled.section`
  margin-top: 12px;
  padding-top: 12px;
  background: #ffffff;
`;

export const RouteMap = styled.div`
  position: relative;
  height: 218px;
  margin: 0 16px;
  overflow: hidden;
  border-radius: 18px;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    position: absolute;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border: 3px solid #ffffff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    color: #ffffff;
    background: ${navy};
    box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
    font-size: 11px;
    font-style: normal;
  }

  span::first-letter {
    transform: rotate(45deg);
  }
`;

export const ScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 18px 14px;

  > div {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  strong {
    color: ${navy};
    font-size: 17px;
  }

  span {
    color: #0088c9;
    font-size: 12px;
  }

  button {
    padding: 7px 10px;
    border-radius: 9px;
    color: ${navy};
    background: #f1f0ff;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const Timeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0 16px 18px;

  > li {
    position: relative;
    padding-left: 28px;
  }

  > li:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 27px;
    bottom: -11px;
    width: 2px;
    border-left: 2px dashed #d4d4df;
  }
`;

export const TimelineNumber = styled.span`
  position: absolute;
  z-index: 1;
  left: 0;
  top: 12px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border: 2px solid #ffffff;
  border-radius: 50%;
  color: #ffffff;
  background: ${navy};
  box-shadow: 0 0 0 1px ${navy};
  font-size: 10px;
`;

export const TimelineCard = styled.article`
  min-height: 100px;
  display: grid;
  grid-template-columns: 74px 1fr 24px;
  gap: 11px;
  padding: 12px;
  border: 1px solid ${border};
  border-radius: 16px;
  background: #ffffff;

  > img {
    width: 74px;
    height: 74px;
    border-radius: 11px;
    object-fit: cover;
  }

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  small {
    color: #0088c9;
    font-size: 9px;
  }

  strong {
    max-width: 100%;
    overflow: hidden;
    color: ${navy};
    font-size: 13px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > div > span {
    max-width: 100%;
    overflow: hidden;
    color: ${muted};
    font-size: 9px;
    line-height: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  select {
    height: 23px;
    margin-top: 6px;
    padding: 0 6px;
    border: 0;
    border-radius: 6px;
    color: #5c5c68;
    background: #f3f3f7;
    font-size: 9px;
  }

  > button {
    align-self: start;
    color: #a5a5af;
    font-size: 21px;
    text-align: center;

    img {
      width: 14px;
      height: 14px;
    }
  }
`;

export const TravelRow = styled.div`
  min-height: 31px;
  display: flex;
  align-items: center;
  padding-left: 13px;
  color: ${muted};
  font-size: 10px;
`;

export const SearchHeader = styled.header`
  min-height: 56px;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 12px;
  padding: 5px 20px;

  > button {
    width: 22px;
    height: 22px;
  }

  > label {
    height: 46px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px 0 14px;
    border: 1.5px solid ${navy};
    border-radius: 12px;
    background: #f7f7fa;
  }

  label > img {
    width: 18px;
    opacity: 0.65;
  }

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: ${navy};
    background: transparent;
    font-size: 15px;
    line-height: 22px;
  }

  input::placeholder {
    color: #a4a5ae;
  }

  label button {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: #ffffff;
    background: #b8b9c1;
    font-size: 15px;
    text-align: center;

    img {
      width: 12px;
      height: 12px;
      filter: brightness(0) invert(1);
    }
  }
`;

export const SearchContext = styled.div`
  height: 43px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 20px;

  span {
    padding: 5px 8px 5px 10px;
    border-radius: 14px;
    color: #0079c2;
    background: #ddf7ff;
    font-size: 12px;
    line-height: 17px;
    font-weight: 700;
  }

  strong {
    color: #5c5c63;
    font-size: 13px;
    line-height: 18px;
    font-weight: 500;
  }
`;

export const SearchTabs = styled.nav`
  height: 47px;
  flex: 0 0 auto;
  display: flex;
  gap: 22px;
  padding: 0 20px;
  border-bottom: 1px solid ${border};

  button {
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${muted};
    font-size: 15px;
    line-height: 22px;
  }

  button[aria-pressed="true"] {
    color: ${navy};
    font-weight: 700;
  }

  button[aria-pressed="true"]::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: ${navy};
  }

  b {
    color: #0088c9;
  }

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
`;

export const SearchScroll = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 20px 116px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const RecentSearches = styled.section`
  margin-bottom: 24px;

  h2 {
    margin: 0 0 12px;
    font-size: 13px;
  }

  > div {
    display: flex;
    gap: 7px;
    overflow-x: auto;
  }

  button {
    flex: 0 0 auto;
    padding: 8px 12px;
    border: 1px solid ${border};
    border-radius: 999px;
    color: #5e5f69;
    background: #ffffff;
    font-size: 11px;
  }
`;

export const ResultHeading = styled.h2`
  margin: 0 0 12px;
  color: ${navy};
  font-size: 15px;
`;

export const PlaceList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li + li {
    border-top: 1px solid #f0f0f3;
  }

  button {
    width: 100%;
    min-height: 91px;
    display: grid;
    grid-template-columns: 72px 1fr 26px;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    text-align: left;
  }

  button:disabled {
    opacity: 0.58;
  }

  button > img {
    width: 72px;
    height: 72px;
    border-radius: 11px;
    object-fit: cover;
  }

  button > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  small {
    color: #0088c9;
    font-size: 9px;
  }

  strong {
    max-width: 100%;
    overflow: hidden;
    color: ${navy};
    font-size: 13px;
    line-height: 21px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  em {
    max-width: 100%;
    overflow: hidden;
    color: ${muted};
    font-size: 10px;
    line-height: 17px;
    font-style: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  i {
    width: 23px;
    height: 23px;
    display: grid;
    place-items: center;
    border: 1.5px solid #cfd0d8;
    border-radius: 50%;
    color: #ffffff;
    font-size: 10px;
    font-style: normal;
  }

  button[aria-pressed="true"] i {
    border-color: ${navy};
    background: ${navy};
  }

  button:disabled i {
    width: auto;
    padding: 0 5px;
    border: 0;
    border-radius: 6px;
    color: #777986;
    background: #ededf1;
    font-size: 8px;
  }
`;

export const GoogleConnect = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 59px;
  text-align: center;

  h2 {
    margin: 24px 0 0;
    color: #1a1a1a;
    font-size: 17px;
    line-height: 24px;
  }

  p {
    margin: 8px 0 0;
    color: ${muted};
    font-size: 13px;
    line-height: 18px;
  }

  button {
    height: 44px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 28px;
    padding: 0 18px;
    border-radius: 22px;
    color: #ffffff;
    background: ${navy};
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
  }

  button img {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
`;

export const NoResults = styled(GoogleConnect)`
  padding-top: 29px;
`;

export const StateIcon = styled.span`
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f3f5fa;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }

  ${NoResults} & img {
    width: 28px;
    height: 28px;
    filter: brightness(0) saturate(100%) invert(6%) sepia(49%) saturate(2397%) hue-rotate(220deg) brightness(74%);
  }
`;

export const ConfirmOverlay = styled.div`
  position: absolute;
  z-index: 50;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgb(0 0 0 / 50%);
`;

export const ConfirmDialog = styled.section`
  width: 100%;
  max-width: 322px;
  padding: 28px 24px 20px;
  border-radius: 24px;
  background: #ffffff;
  text-align: center;

  h2 {
    margin: 0;
    color: #1a1a1a;
    font-size: 17px;
    line-height: 24px;
  }

  p {
    margin: 8px 0 24px;
    color: #5c5c63;
    font-size: 14px;
    line-height: 20px;
  }

  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  button {
    height: 52px;
    border-radius: 14px;
    background: #f3f5fa;
    font-size: 15px;
    line-height: 22px;
    font-weight: 700;
    text-align: center;
  }

  button:last-child {
    color: #ffffff;
    background: ${navy};
  }
`;


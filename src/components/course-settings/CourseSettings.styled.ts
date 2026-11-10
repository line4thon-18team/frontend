import styled from "styled-components";

const focusRing = `
  outline: 3px solid rgba(91, 79, 232, 0.45);
  outline-offset: 2px;
`;

export const PageShell = styled.div`
  min-height: 100dvh;
  background: #f2f3f6;
  color: #0a0a1a;
`;

export const Page = styled.main`
  position: relative;
  width: 100%;
  max-width: 402px;
  min-height: max(100dvh, 874px);
  margin: 0 auto;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 0 28px rgba(10, 10, 26, 0.08);

  button {
    color: inherit;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  button:focus-visible,
  input:focus-visible {
    ${focusRing}
  }

  @media (max-width: 402px) {
    min-height: 100dvh;
    box-shadow: none;
  }
`;

export const Navigation = styled.nav`
  height: 42px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;

  button,
  > span {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
  }

  button img {
    width: 24px;
    height: 24px;
  }

  h1 {
    margin: 0;
    text-align: center;
    font-size: 18px;
    line-height: 1.4;
    font-weight: 700;
    letter-spacing: -0.4px;
  }
`;

export const SettingsContent = styled.div`
  padding: 29px 20px 80px;
`;

export const SettingsSection = styled.section`
  h2 {
    margin: 0 0 13px 4px;
    color: #8a8a8e;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 500;
    letter-spacing: -0.2px;
  }
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MenuButton = styled.button`
  width: 100%;
  min-height: 52px;
  padding: 12px 4px 12px 5px !important;
  display: grid;
  grid-template-columns: 24px 1fr 28px;
  gap: 14px;
  align-items: center;
  text-align: left;
  border-radius: 10px !important;

  &:hover {
    background: #f7f7fa;
  }

  > img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  > span:nth-child(2) {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 500;
    letter-spacing: -0.35px;
  }
`;

export const Chevron = styled.img`
  width: 16px !important;
  height: 16px !important;
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 25px 0 27px;
  border: 0;
  background: #ececf0;
`;

export const ActionBadge = styled.span<{ $tone: "cyan" | "pink" }>`
  position: relative;
  width: 24px;
  height: 24px;
  justify-self: center;
  border-radius: 50%;
  background: ${({ $tone }) => ($tone === "cyan" ? "#00e1ff" : "#ff7891")};

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 11px;
    height: 2px;
    border-radius: 2px;
    background: #ffffff;
    transform: translate(-50%, -50%);
  }

  &::after {
    display: ${({ $tone }) => ($tone === "cyan" ? "block" : "none")};
    transform: translate(-50%, -50%) rotate(90deg);
  }
`;

export const LeaveIcon = styled.span`
  position: relative;
  width: 24px;
  height: 24px;
  display: block;

  &::before {
    content: "";
    position: absolute;
    inset: 3px 7px 3px 2px;
    border: 2px solid #333333;
    border-right: 0;
    border-radius: 3px 0 0 3px;
  }

  &::after {
    content: "";
    position: absolute;
    right: 1px;
    top: 11px;
    width: 12px;
    height: 2px;
    border-radius: 1px;
    background: #333333;
  }

  span::before,
  span::after {
    content: "";
    position: absolute;
    right: 1px;
    width: 7px;
    height: 2px;
    border-radius: 1px;
    background: #333333;
    transform-origin: right center;
  }

  span::before {
    top: 8px;
    transform: rotate(45deg);
  }

  span::after {
    top: 14px;
    transform: rotate(-45deg);
  }
`;

export const LiveRegion = styled.p`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 24px;
  margin: 0;
  color: #696970;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
`;

export const SheetLayer = styled.div`
  position: fixed;
  z-index: 20;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(10, 10, 26, 0.45);
`;

export const BottomSheet = styled.section`
  position: relative;
  width: 100%;
  max-width: 402px;
  height: min(527px, calc(100dvh - 72px));
  padding: 0 20px max(24px, env(safe-area-inset-bottom));
  overflow-y: auto;
  scrollbar-width: none;
  border-radius: 26px 26px 0 0;
  background: #ffffff;
  color: #0a0a1a;
  box-shadow: 0 -8px 30px rgba(10, 10, 26, 0.08);

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Grabber = styled.div`
  position: absolute;
  top: 9px;
  left: 50%;
  width: 39px;
  height: 4px;
  transform: translateX(-50%);
  border-radius: 4px;
  background: #d9d9de;
`;

export const SheetHeader = styled.header`
  height: 74px;
  padding-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 19px;
    line-height: 1.45;
    font-weight: 700;
    letter-spacing: -0.45px;
  }

  button {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const TripDetails = styled.dl`
  margin: 8px 0 0;
  border-top: 1px solid #ececf0;
`;

export const DetailRow = styled.div`
  min-height: 68px;
  display: grid;
  grid-template-columns: 91px 1fr;
  align-items: center;
  border-bottom: 1px solid #ececf0;

  dt,
  dd {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: -0.25px;
  }

  dt {
    color: #8a8a8e;
    font-weight: 500;
  }

  dd {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1f1f2c;
    font-weight: 500;
  }

  dd > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  dd button {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  dd button img {
    width: 20px;
    height: 20px;
  }
`;

export const NameEditor = styled.input`
  min-width: 0;
  width: 100%;
  height: 36px;
  padding: 5px 8px;
  border: 1px solid #5b4fe8;
  border-radius: 8px;
  color: #1f1f2c;
  background: #ffffff;
`;

export const InviteContent = styled.div`
  padding-top: 3px;
`;

export const LinkBox = styled.div`
  height: 51px;
  padding: 0 8px 0 14px;
  display: grid;
  grid-template-columns: 17px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  border: 1px solid #e1e1e6;
  border-radius: 10px;
  background: #f8f8fa;

  > img {
    width: 16px;
    height: 16px;
  }

  > span {
    min-width: 0;
    overflow: hidden;
    color: #595961;
    font-size: 12px;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    height: 35px;
    padding: 0 12px !important;
    border-radius: 8px !important;
    background: #5b4fe8 !important;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
`;

export const CopyMessage = styled.p<{ $visible: boolean }>`
  height: 32px;
  margin: 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #5b4fe8;
  font-size: 12px;
  line-height: 1.4;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 160ms ease;
`;

export const SuccessIcon = styled.span`
  position: relative;
  width: 16px;
  height: 16px;
  display: inline-block;

  img {
    position: absolute;
    inset: 0;
    width: 16px;
    height: 16px;
  }
`;

export const MemberSection = styled.section`
  margin-top: 7px;

  h3 {
    margin: 0 0 8px;
    color: #8a8a8e;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
  }
`;

export const MemberList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    min-height: 54px;
    display: grid;
    grid-template-columns: 38px 1fr auto;
    gap: 11px;
    align-items: center;
  }

  li > img {
    width: 38px;
    height: 38px;
    object-fit: contain;
    border-radius: 50%;
  }

  strong {
    font-size: 14px;
    line-height: 1.4;
    font-weight: 500;
  }

  strong small {
    color: #8a8a8e;
    font-size: 12px;
    font-weight: 400;
  }

  li > span {
    padding: 5px 9px;
    border-radius: 12px;
    background: #f2f0ff;
    color: #5b4fe8;
    font-size: 10px;
    font-weight: 500;
    line-height: 1.4;
  }
`;

export const ShareSection = styled.section`
  margin-top: 12px;
  padding-top: 13px;
  border-top: 1px solid #ececf0;

  h3 {
    margin: 0 0 10px;
    color: #8a8a8e;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
  }
`;

export const ShareList = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  list-style: none;

  button {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  img {
    width: 43px;
    height: 43px;
    object-fit: contain;
    border-radius: 12px;
  }

  span {
    color: #595961;
    font-size: 10px;
    line-height: 1.4;
    white-space: nowrap;
  }
`;

export const CloseConfirmLayer = styled.div`
  position: fixed;
  z-index: 30;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(10, 10, 26, 0.28);
`;

export const CloseConfirmDialog = styled.section`
  width: 100%;
  max-width: 322px;
  padding: 28px 24px 20px;
  overflow: hidden;
  border-radius: 20px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 12px 36px rgba(10, 10, 26, 0.18);

  h2 {
    margin: 0;
    color: #1a1a1a;
    font-size: 18px;
    line-height: 25px;
    font-weight: 700;
    letter-spacing: -0.09px;
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
    height: 50px;
    border-radius: 12px !important;
    background: #f3f5fa !important;
    color: #5c5c63;
    font-size: 15px;
    line-height: 22px;
    font-weight: 700;
    text-align: center;
  }

  button:last-child {
    color: #ffffff;
    background: #090738 !important;
  }
`;

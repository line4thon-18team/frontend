import styled from "styled-components";
import { Link } from "react-router";
export const Header = styled.header`
  min-height: 54px;
  padding: calc(12px + env(safe-area-inset-top)) 20px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const MyTripsHeader = styled.header`
  min-height: 50px;
  padding: env(safe-area-inset-top) 20px 0;
  display: flex;
  align-items: center;
  gap: 18px;

  h1 {
    margin: 0;
    flex: 1;
    color: #12133f;
    font-size: 22px;
    line-height: 30px;
    font-weight: 700;
  }

  a {
    display: grid;
    place-items: center;
    width: 26px;
    height: 40px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const MyHeader = styled.header`
  min-height: 54px;
  padding: env(safe-area-inset-top) 20px 0;
  display: flex;
  align-items: center;

  h1 {
    margin: 0;
    color: #1a1a1a;
    font-size: 22px;
    line-height: 30px;
    font-weight: 700;
  }
`;

export const PlusIcon = styled.span`
  position: relative;
  display: block;
  width: 24px;
  height: 24px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 11px;
    left: 3px;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: #1a1a1a;
  }

  &::after {
    transform: rotate(90deg);
  }
`;
export const Logo = styled(Link)`
  position: relative;
  width: 91px;
  height: 22px;
  overflow: hidden;
  img {
    position: absolute;
    height: 100%;
    width: 130.72%;
    max-width: none;
    left: -30.72%;
  }
`;
export const NotificationButton = styled(Link)`
  display: grid;
  place-items: center;
  min-width: 44px;
  min-height: 44px;
  margin-right: -8px;
  img {
    width: 28px;
    height: 28px;
  }
`;
export const CourseHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: calc(10px + env(safe-area-inset-top)) 20px 10px;
  min-height: 52px;
  h1 {
    margin: 0;
    flex: 1;
    font-size: 14px;
    line-height: 19px;
    font-weight: 700;
  }
  a {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
  }
  button {
    display: grid;
    place-items: center;
    width: 20px;
    height: 22px;
  }
`;

export const TripHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(12px + env(safe-area-inset-top)) 20px 9px;
  min-height: 49px;
  @media (max-height: 600px) {
    padding-top: 16px;
    min-height: 53px;
  }
  button {
    display: grid;
    place-items: center;
    min-width: 28px;
    min-height: 28px;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
  span {
    font-size: 14px;
    color: #7b6fe9;
  }
`;
export const Progress = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 6px;
  padding: 0 20px;
  span {
    height: 6px;
    flex: 1;
    border-radius: 8px;
    background: #dde5e8;
  }
  span[data-filled="true"] {
    background: linear-gradient(90deg, #a5a5ff73, #6b6bd9);
  }
`;

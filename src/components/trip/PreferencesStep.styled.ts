import { Step } from "./Trip.styled";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to { transform: rotate(360deg); }
`;

export const AnalysisProgress = styled(Step)`
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
  text-align: center;
  color: #090738;
  font-weight: 700;

  span {
    width: 36px;
    height: 36px;
    border: 3px solid #e2e1ee;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: ${rotate} 0.8s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  p { margin: 0; }
`;
export const Prompt = styled.div<{ $active: boolean; $analyzed: boolean }>`
  position: relative;
  margin-top: 35px;
  height: 132px;
  border: 1.5px solid ${({ $active }) => ($active ? "#090738" : "transparent")};
  border-radius: 16px;
  background: ${({ $analyzed }) => ($analyzed ? "white" : "#f5f6f8")};
  padding: 14.5px 16.5px 38px;
  textarea {
    font: inherit;
    font-size: 15px;
    line-height: 1.55;
    background: none;
    border: 0;
    outline: 0;
    width: 100%;
    height: 76px;
    resize: none;
    min-height: 76px;
  }
  textarea::placeholder {
    color: #a8a8ae;
  }
  span {
    position: absolute;
    bottom: 14px;
    right: 18px;
    font-size: 11px;
    color: #b5b5bd;
  }
`;
export const Analysis = styled.div`
  border: 1px solid #e2e1ee;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #090738;
    font-size: 15px;
    font-weight: 700;
  }
  section {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  section > span {
    font-size: 13px;
    color: #8a8a8e;
    width: 40px;
    flex-shrink: 0;
  }
`;
export const Preferences = styled(Step)`
  gap: 16px;
  header {
    min-width: 0;
  }
  > div:first-child p {
    line-height: 20px;
    margin-top: 4px;
  }
`;
export const ExampleTitle = styled.h2`
  font-size: 15px;
  margin: 14px 0;
`;
export const TasteNumber = styled.span`
  display: inline-grid;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
  background: #090738;
  color: white;
  font-size: 10px;
`;

export const AnalysisChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 14px;
  background: #f3f4f7;
  color: #090738;
  font-size: 13px;
  line-height: 1.25;
  font-weight: 700;
`;

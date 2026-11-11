import styled from "styled-components";
export const Generation = styled.div`
  > * {
    flex-shrink: 0;
  }
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: clip;
  scrollbar-width: none;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 0 48px;
  gap: 24px;
  h1 {
    font-size: 24px;
    line-height: 1.4;
    margin: 0;
  }
  p {
    color: #8a8a8e;
    margin: 8px 0 0;
    font-size: 14px;
  }
  @media (max-height: 600px) {
    padding-top: 24px;
    gap: 20px;
  }
`;
export const SymbolBox = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 92px;
  height: 92px;
  margin-bottom: 90px;
  border-radius: 28px;
  background: white;
  box-shadow: 0 10px 28px #0a08381f;
  overflow: hidden;
  > div {
    position: absolute;
    left: 17px;
    top: 21px;
    width: 58px;
    height: 50px;
    overflow: hidden;
  }
  img {
    position: absolute;
    height: 100%;
    width: 464.81%;
    max-width: none;
    left: 0;
    top: 0;
  }
  @media (max-height: 600px) {
    margin-bottom: 24px;
  }
`;
export const GenerationSteps = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  max-width: 100%;
  text-align: left;
  li[data-pending="true"] {
    color: #a8a8ae;
  }
  li {
    display: flex;
    align-items: flex-start;
    min-height: 47px;
    gap: 16px;
    font-size: 14px;
    font-weight: 700;
  }
  img {
    flex-shrink: 0;
  }
`;

export const GenerationGlow = styled.img<{ $tone: "purple" | "cyan" }>`
  position: absolute;
  z-index: -1;
  pointer-events: none;
  left: ${({ $tone }) => ($tone === "purple" ? "calc(50% - 176px)" : "calc(50% - 70px)")};
  top: ${({ $tone }) => ($tone === "purple" ? "-19px" : "35px")};
`;

export const GenerationNotice = styled.p`
  margin: -16px 0 0 !important;
  color: #5c5c63 !important;
  font-size: 12px !important;
  line-height: 17px;
`;

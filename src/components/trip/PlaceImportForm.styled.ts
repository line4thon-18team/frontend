import styled, { keyframes } from "styled-components";
import { Primary } from "./Trip.styled";

const spin = keyframes`to { transform: rotate(360deg); }`;
const fade = keyframes`50% { opacity: 0.4; }`;

export const Flow = styled.section`
  display: flex; min-height: 100%; flex: 1; flex-direction: column; gap: 20px; color: #1a1a1a;
  min-width: 0;
`;

export const Heading = styled.header`
  h1 { margin: 0; font-size: 22px; line-height: 30px; letter-spacing: -0.4px; }
  p { display: flex; align-items: center; gap: 6px; margin: 7px 0 0; color: #8a8a8e; font-size: 13px; line-height: 20px; }
  p img { width: 14px; height: 18px; object-fit: contain; }
`;

export const ImportEntry = styled(Flow)`
  gap: 24px;
`;

export const ImportHeading = styled(Heading)`
  h1 { letter-spacing: 0; }
  p { gap: 5px; margin-top: 10px; font-weight: 500; line-height: 18px; }
  p img { width: 14px; height: 14px; flex: none; }
`;

export const MethodList = styled.div`display: flex; flex-direction: column; gap: 24px;`;

export const MethodCard = styled.button<{ $file?: boolean }>`
  width: 100%; display: flex; align-items: center; gap: ${({ $file }) => $file ? "12px" : "14px"};
  padding: ${({ $file }) => $file ? "16px" : "18px 16px 18px 18px"};
  border: 1px solid #e4e6ec; border-radius: 16px; background: #fff; text-align: left;
  > img { flex: none; }
`;

export const MethodIcon = styled.span<{ $tone: "blue" | "purple" }>`
  width: 44px; height: 44px; display: grid; place-items: center; flex: none;
  border-radius: ${({ $tone }) => $tone === "blue" ? "12px" : "50%"};
  background: ${({ $tone }) => $tone === "blue" ? "#ddf7ff" : "#efedff"};
`;

export const MethodContent = styled.span<{ $file?: boolean }>`
  min-width: 0; flex: 1; display: flex; flex-direction: column;
  gap: ${({ $file }) => $file ? "2px" : "6px"};
  strong { font-size: ${({ $file }) => $file ? "14px" : "16px"}; line-height: ${({ $file }) => $file ? "19px" : "22px"}; }
  > span { color: #5c5c63; font-size: 12px; line-height: 16px; font-weight: 400; }
`;

export const Badges = styled.span`
  display: flex; flex-wrap: wrap; gap: 6px;
  span { padding: 3px 8px; border-radius: 6px; background: #f3f5fa; color: #8a8a8e; font-size: 11px; line-height: 15px; font-weight: 500; }
  span:first-child { background: #efedff; color: #6b6bcc; }
`;

export const InfoBox = styled.div`
  display: flex; align-items: flex-start; gap: 8px; margin-top: 11px; padding: 14px; border-radius: 12px; background: #f3f5fa;
  img { width: 16px; height: 16px; flex: none; }
  p { margin: 0; color: #5c5c63; font-size: 12px; line-height: 16px; font-weight: 400; }
`;

export const SkipButton = styled.button`
  min-height: 44px; margin-top: auto; color: #090738; font-size: 14px; text-align: center;
  cursor: pointer;
`;

export const MethodSkipButton = styled(Primary)`
  margin-top: auto;
  margin-bottom: max(36px, env(safe-area-inset-bottom));
  cursor: pointer;
  &:active { background: #24214f; }
  &:focus-visible { outline: 2px solid #6456c4; outline-offset: 2px; }
`;

export const GuideList = styled.ol`
  display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none;
`;

export const GuideStep = styled.li`
  display: grid; gap: 10px; padding: 16px; border: 1px solid #e0e3eb; border-radius: 16px;
  &:first-child { border-color: #090738; }
  > div { display: flex; align-items: flex-start; gap: 12px; }
  b { width: 28px; height: 28px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; background: #daf5fc; color: #0079c2; font-size: 13px; }
  &:first-child b { background: #090738; color: #fff; }
  strong { display: block; font-size: 16px; line-height: 22px; }
  small { display: block; color: #6b6b70; font-size: 12px; line-height: 18px; }
`;

export const GuideChecks = styled.section`
  display: grid; gap: 8px; padding: 14px; border-radius: 12px; background: #f1f3f9;
  p { display: flex; gap: 8px; margin: 0; align-items: center; font-size: 14px; line-height: 19px; }
  img { width: 16px; height: 16px; flex: 0 0 auto; }
`;

export const WaitTime = styled.span`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #fff8d6;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  img { width: 14px; height: 14px; }
`;

export const ExternalLink = styled.a`
  min-height: 42px; display: flex; align-items: center; justify-content: center; gap: 6px;
  border-radius: 12px; background: #ddf7ff; color: #0079c2;
  font-size: 13px; font-weight: 500; text-decoration: none;
  img { width: 14px; height: 14px; }
`;

export const DropZone = styled.button`
  min-height: 234px; display: flex; align-items: center; justify-content: center; flex-direction: column;
  border: 1px dashed #d1d1d6; border-radius: 18px; background: #fff; cursor: pointer;
  strong { margin-top: 12px; font-size: 15px; } span { margin-top: 4px; color: #a0a0a5; font-size: 11px; }
  > b { display: flex; align-items: center; gap: 5px; margin-top: 13px; padding: 7px 12px; border: 1px solid #dedee5; border-radius: 8px; font-size: 11px; }
  > b img { width: 14px; height: 14px; }
`;

export const EmptyIcon = styled.span`
  width: 80px; height: 80px; display: grid; place-items: center; border-radius: 50%; background: #f4f4f7;
  img { width: 68px; height: 68px; }
`;

export const SelectedFile = styled.div<{ $error: boolean }>`
  display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid ${({ $error }) => $error ? "#e5484d" : "#e4e6ec"}; border-radius: 16px;
  > div { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 2px; }
  strong { overflow: hidden; font-size: 14px; line-height: 19px; text-overflow: ellipsis; white-space: nowrap; }
  span { color: ${({ $error }) => $error ? "#e5484d" : "#8a8a8e"}; font-size: 12px; line-height: 16px; }
  button { flex: 0 0 auto; color: #5c5c63; font-size: 13px; }
  button:first-of-type { padding: 6px 10px; border-radius: 8px; background: #f3f5fa; }
  button:last-of-type { display: grid; place-items: center; width: 28px; height: 28px; }
  button img { width: 18px; height: 18px; }
`;

export const FileIcon = styled.span<{ $error: boolean }>`
  width: 44px; height: 44px; display: grid; flex: none; place-items: center; border-radius: 12px;
  background: ${({ $error }) => $error ? "#e4e6ec" : "#ddf7ff"};
  img { width: 22px; height: 22px; filter: ${({ $error }) => $error ? "grayscale(1)" : "none"}; }
`;

export const FileField = styled.div`
  display: grid;
  gap: 8px;
`;

export const SupportBox = styled.div`
  display: flex; flex-direction: column; gap: 8px; padding: 16px; border-radius: 12px; background: #f3f5fa;
  > strong { margin-bottom: 2px; font-size: 14px; line-height: 19px; }
  p { display: flex; align-items: flex-start; gap: 8px; margin: 0; color: #5c5c63; font-size: 12px; line-height: 16px; }
  p img { width: 16px; height: 16px; flex: 0 0 auto; }
`;

export const ErrorBox = styled.div`
  display: flex; align-items: flex-start; gap: 12px; padding: 16px; border-radius: 12px; background: #fff0f0;
  img { width: 16px; height: 16px; flex: 0 0 auto; }
  p { display: grid; gap: 4px; margin: 0; }
  strong { color: #e5484d; font-size: 14px; line-height: 19px; }
  small { color: #5c5c63; font-size: 12px; line-height: 16px; }
`;

export const FieldError = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 0 4px;
  color: #e5484d;
  font-size: 12px;
  line-height: 16px;
  img { width: 16px; height: 16px; flex: none; }
`;

export const FormFooter = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-top: auto; padding-top: 12px;
  flex-shrink: 0;
`;

export const PrimaryButton = styled.button<{ $busy?: boolean }>`
  width: 100%; min-height: 56px; border-radius: 16px; background: #090738; color: #fff; font-size: 16px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 16px;
  line-height: 1.5;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  &:disabled {
    background: ${({ $busy }) => $busy ? "#090738" : "#e4e6ec"};
    color: ${({ $busy }) => $busy ? "#fff" : "#8a8a8e"};
    cursor: default;
  }
`;

export const Spinner = styled.img`
  display: block;
  flex: none;
  animation: ${spin} 0.85s linear infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const GuideLink = styled.button`
  min-height: 36px; display: flex; align-items: center; justify-content: center; gap: 2px; color: #0079c2; font-size: 12px;
  margin-top: -8px;
  img { width: 13px; height: 13px; }
`;

export const LinkForm = styled.form`
  display: flex; min-height: 320px; flex: 1; flex-direction: column;
  > ${FormFooter} {
    position: sticky; bottom: 0; padding: 13px 0 max(36px, env(safe-area-inset-bottom));
    background: linear-gradient(transparent, #fff 13px);
  }
`;

export const LinkField = styled.div`
  display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px;
  label { color: #5c5c63; font-size: 13px; font-weight: 500; line-height: 18px; }
`;

export const LinkInput = styled.div<{ $invalid: boolean }>`
  display: flex; gap: 8px; align-items: center; min-height: 52px; padding: 8px 8px 8px 16px;
  box-shadow: inset 0 0 0 1px ${({ $invalid }) => $invalid ? "#e5484d" : "transparent"};
  border-radius: 12px; background: #f3f5fa;
  &:focus-within { box-shadow: inset 0 0 0 1px ${({ $invalid }) => $invalid ? "#e5484d" : "#090738"}; }
  input { flex: 1; min-width: 0; padding: 0; border: 0; background: transparent; font-size: 14px; font-weight: 400; line-height: 19px; }
  input:focus-visible { outline: none; }
  input::placeholder { color: #b4b5bd; }
  input[readonly] { color: #8a8a8e; text-overflow: ellipsis; }
  > img { flex: none; margin-right: 8px; }
  button {
    display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
    min-height: 36px; padding: 6px 12px; border: 1px solid #e4e6ec; border-radius: 8px;
    background: #fff; color: #5c5c63; font-size: 13px; font-weight: 500;
  }
  button:not(.clear-link) { min-width: 92px; justify-content: center; }
  .clear-link {
    width: 34px;
    min-height: 34px;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
  }
`;

export const LinkProgress = styled.p`
  display: flex; align-items: center; gap: 8px;
  min-height: 16px; margin: 0; padding-left: 4px;
  color: #5c5c63; font-size: 12px; line-height: 16px;
`;

export const LinkGuide = styled.section`
  margin-top: 13px; padding: 16px 16px 15px; border: 1px solid #e4e6ec; border-radius: 16px;
  h2 { margin: 0; font-size: 14px; line-height: 19px; }
  ol { display: grid; gap: 10px; margin: 12px 0 0; padding: 0; list-style: none; counter-reset: step; }
  li { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 10px; color: #5c5c63; font-size: 12px; line-height: 16px; }
  li::before {
    counter-increment: step; content: counter(step);
    display: grid; place-items: center; width: 20px; height: 20px; flex: none;
    border-radius: 50%; background: #f3f5fa; font-size: 11px; font-weight: 500;
  }
  p { margin: 0; padding: 2px 0; line-height: 16px; font-weight: 400; }
  img { display: block; max-width: 100%; height: auto; }
  li:first-child img, li:nth-child(3) img { margin-top: 6px; }
  li:last-child img { margin-top: 3px; }
  a { color: inherit; text-decoration: none; }
  a:focus-visible { outline: 2px solid #6456c4; outline-offset: 2px; }
`;

export const ImportProgress = styled.div`
  display: flex; flex: 1; min-height: 360px; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  .character { width: 160px; height: 160px; object-fit: contain; }
  h1 { margin: 20px 0 14px; font-size: 20px; line-height: 28px; }
  p { margin: 0 0 16px; color: #8a8a8e; font-size: 14px; line-height: 19px; }
  .dots { animation: ${fade} 1.4s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .dots { animation: none; } }
`;

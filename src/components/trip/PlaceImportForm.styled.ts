import styled from "styled-components";

export const Flow = styled.section`
  display: flex; min-height: 100%; flex: 1; flex-direction: column; gap: 20px; color: #1a1a1a;
  min-width: 0;
`;

export const Heading = styled.header`
  h1 { margin: 0; font-size: 24px; line-height: 34px; letter-spacing: -0.4px; }
  p { display: flex; align-items: center; gap: 6px; margin: 7px 0 0; color: #8a8a8e; font-size: 13px; line-height: 20px; }
  p img { width: 14px; height: 18px; object-fit: contain; }
`;

export const MethodList = styled.div`display: flex; flex-direction: column; gap: 12px;`;

export const MethodCard = styled.button`
  width: 100%; min-height: 126px; display: flex; align-items: center; gap: 12px; padding: 18px 14px;
  border: 1px solid #e5e5ea; border-radius: 18px; background: #fff; text-align: left; box-shadow: 0 1px 2px rgb(10 8 56 / 3%);
  > img { width: 14px; height: 14px; flex: 0 0 auto; }
`;

export const MethodIcon = styled.span<{ $tone: "blue" | "purple" }>`
  width: 52px; height: 52px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%;
  background: ${({ $tone }) => $tone === "blue" ? "#e8f7ff" : "#f0eeff"};
  img { width: 24px; height: 24px; }
`;

export const MethodContent = styled.span`
  min-width: 0; flex: 1;
  strong { display: block; font-size: 15px; line-height: 22px; }
  p { margin: 5px 0 10px; color: #6b6b70; font-size: 12px; line-height: 18px; word-break: keep-all; }
`;

export const Badges = styled.span`
  display: flex; flex-wrap: wrap; gap: 4px;
  b, span { padding: 3px 7px; border-radius: 999px; background: #f4f4f7; color: #8a8a8e; font-size: 10px; line-height: 14px; font-weight: 500; }
  b { background: #e9f8ff; color: #0079c2; font-weight: 700; }
`;

export const InfoBox = styled.div`
  display: flex; align-items: flex-start; gap: 8px; padding: 14px; border-radius: 12px; background: #f6f6f8;
  img { width: 16px; height: 16px; margin-top: 1px; }
  p { margin: 0; color: #77777d; font-size: 11px; line-height: 17px; word-break: keep-all; }
`;

export const SkipButton = styled.button`
  min-height: 40px; margin-top: auto; color: #8a8a8e; font-size: 14px; text-align: center;
`;

export const GuideNotice = styled(InfoBox)`
  background: #fff9d9; p { color: #5f5b40; } strong { color: #292719; }
`;

export const GuideList = styled.ol`
  display: flex; flex-direction: column; gap: 16px; margin: 0; padding: 0; list-style: none;
`;

export const GuideStep = styled.li`
  display: flex; align-items: flex-start; gap: 12px;
  > b { width: 22px; height: 22px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; background: #e8f7ff; color: #0079c2; font-size: 11px; }
  div { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
  strong { font-size: 13px; line-height: 19px; } small { color: #8a8a8e; font-size: 11px; line-height: 16px; }
`;

export const ExternalLink = styled.a`
  min-height: 42px; display: grid; place-items: center; border: 1px solid #dadae2; border-radius: 12px;
  color: #1a1a1a; font-size: 13px; font-weight: 700; text-decoration: none;
`;

export const DropZone = styled.label`
  min-height: 164px; display: flex; align-items: center; justify-content: center; flex-direction: column;
  border: 1.5px dashed #d9d9df; border-radius: 18px; cursor: pointer;
  strong { margin-top: 12px; font-size: 15px; } span { margin-top: 4px; color: #a0a0a5; font-size: 11px; }
  > b { display: flex; align-items: center; gap: 5px; margin-top: 13px; padding: 7px 12px; border: 1px solid #dedee5; border-radius: 8px; font-size: 11px; }
  > b img { width: 14px; height: 14px; }
`;

export const EmptyIcon = styled.span`
  width: 62px; height: 62px; display: grid; place-items: center; border-radius: 50%; background: #f4f4f7;
  img { width: 52px; height: 52px; }
`;

export const SelectedFile = styled.div<{ $error: boolean }>`
  display: flex; align-items: center; gap: 10px; padding: 13px; border: 1px solid ${({ $error }) => $error ? "#e5484d" : "#e4e4e9"}; border-radius: 14px;
  > div { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 2px; }
  strong { overflow: hidden; font-size: 12px; line-height: 18px; text-overflow: ellipsis; white-space: nowrap; }
  span { color: #8a8a8e; font-size: 10px; } button { flex: 0 0 auto; color: #6b6b70; font-size: 11px; }
  button img { width: 18px; height: 18px; }
`;

export const FileIcon = styled.span<{ $error: boolean }>`
  width: 38px; height: 38px; display: grid; place-items: center; border-radius: 10px;
  background: ${({ $error }) => $error ? "#fff0f0" : "#e8f7ff"}; img { width: 22px; height: 22px; }
`;

export const SupportBox = styled.div`
  display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 14px; background: #f6f6f8;
  > strong { margin-bottom: 2px; font-size: 12px; }
  p { display: flex; align-items: flex-start; gap: 7px; margin: 0; color: #6f6f75; font-size: 10px; line-height: 16px; }
  p img { width: 14px; height: 14px; flex: 0 0 auto; }
`;

export const ErrorBox = styled.div`
  display: flex; align-items: flex-start; gap: 8px; padding: 12px; border: 1px solid #ffd1d1; border-radius: 12px; background: #fff5f5;
  img { width: 16px; height: 16px; flex: 0 0 auto; }
  p { margin: 0; color: #ba3131; font-size: 12px; line-height: 18px; } small { color: #8a6363; font-size: 10px; }
`;

export const FormFooter = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-top: auto; padding-top: 12px;
  flex-shrink: 0;
`;

export const PrimaryButton = styled.button`
  width: 100%; min-height: 54px; border-radius: 14px; background: #090738; color: #fff; font-size: 15px; font-weight: 700;
  padding: 12px 16px;
  line-height: 1.5;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  &:disabled { background: #ececf1; color: #a8a8ae; cursor: default; }
`;

export const GuideLink = styled.button`
  min-height: 36px; display: flex; align-items: center; justify-content: center; gap: 2px; color: #0079c2; font-size: 11px;
  img { width: 13px; height: 13px; }
`;

export const LinkForm = styled.form`
  display: flex; min-height: 320px; flex: 1; flex-direction: column; gap: 10px;
  label { font-size: 13px; font-weight: 700; }
  input { width: 100%; min-width: 0; padding: 14px; border: 1px solid #dedee5; border-radius: 12px; font-size: 13px; outline: none; }
  input:focus { border-color: #090738; box-shadow: 0 0 0 2px rgb(9 7 56 / 8%); }
`;

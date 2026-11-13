import { useEffect, useState } from "react";
import { Link } from "react-router";
import backIcon from "../assets/icons/nav-back.svg";
import { routes } from "../config/routes";
import {
  readNotificationSettings,
  saveNotificationSettings,
  type NotificationSettingKey,
} from "../utils/mySettings";
import * as S from "./NotificationSettingsPage.styled";

interface SettingItem {
  key: NotificationSettingKey;
  label: string;
  description: string;
}

const groups: { title: string; items: SettingItem[] }[] = [
  {
    title: "여행 일정",
    items: [
      {
        key: "scheduleChanges",
        label: "일정 변경",
        description: "동행자가 장소를 추가하거나 지우면 알려요",
      },
      {
        key: "tripReminder",
        label: "여행 리마인더",
        description: "출발 7일 전, 1일 전에 알려요",
      },
    ],
  },
  {
    title: "동행자",
    items: [
      {
        key: "chatMessages",
        label: "채팅 메시지",
        description: "여행 채팅방의 새 메시지",
      },
      {
        key: "commentsAndMentions",
        label: "댓글과 멘션",
        description: "내 의견에 답글이 달리거나 @멘션되면 알려요",
      },
      {
        key: "voteResults",
        label: "투표 결과",
        description: "투표가 끝나면 결과를 알려요",
      },
    ],
  },
  {
    title: "혜택과 소식",
    items: [
      {
        key: "eventsAndBenefits",
        label: "이벤트와 혜택",
        description: "새 기능과 이벤트 소식 (선택)",
      },
    ],
  },
];

function Toggle({
  checked,
  disabled = false,
  label,
  onClick,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <S.Toggle
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <span />
    </S.Toggle>
  );
}

function NotificationSettingsPage() {
  const [settings, setSettings] = useState(() =>
    readNotificationSettings(window.localStorage),
  );

  useEffect(() => {
    saveNotificationSettings(window.localStorage, settings);
  }, [settings]);

  const toggleSetting = (key: NotificationSettingKey) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <S.Page>
      <S.Header>
        <Link to={routes.my} aria-label="마이 화면으로 돌아가기">
          <img src={backIcon} alt="" />
        </Link>
        <h1>알림 설정</h1>
      </S.Header>

      <S.MasterSection>
        <S.SettingText>
          <strong>전체 알림</strong>
          <small>끄면 여행 알림을 모두 받지 않아요</small>
        </S.SettingText>
        <Toggle
          checked={settings.allNotifications}
          label="전체 알림"
          onClick={() =>
            setSettings((current) => ({
              ...current,
              allNotifications: !current.allNotifications,
            }))
          }
        />
      </S.MasterSection>

      {groups.map((group) => (
        <S.Group key={group.title} $disabled={!settings.allNotifications}>
          <h2>{group.title}</h2>
          {group.items.map((item) => (
            <S.SettingRow key={item.key}>
              <S.SettingText>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </S.SettingText>
              <Toggle
                checked={settings.allNotifications && settings[item.key]}
                disabled={!settings.allNotifications}
                label={item.label}
                onClick={() => toggleSetting(item.key)}
              />
            </S.SettingRow>
          ))}
        </S.Group>
      ))}
      <S.HomeIndicator />
    </S.Page>
  );
}

export default NotificationSettingsPage;

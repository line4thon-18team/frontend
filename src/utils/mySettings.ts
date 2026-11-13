export type ProfileAvatar = "blue" | "purple";

export interface UserProfileSettings {
  nickname: string;
  email: string;
  introduction: string;
  avatar: ProfileAvatar;
  travelPreferences?: string[];
}

export interface NicknameValidation {
  valid: boolean;
  tone: "default" | "success" | "error";
  message: string;
}

export const PROFILE_STORAGE_KEY = "dotlo.profile";
export const NOTIFICATION_STORAGE_KEY = "dotlo.notifications";
export const GOOGLE_MAPS_STORAGE_KEY = "dotlo.google-maps";

export type NotificationSettingKey =
  | "scheduleChanges"
  | "tripReminder"
  | "chatMessages"
  | "commentsAndMentions"
  | "voteResults"
  | "eventsAndBenefits";

export interface NotificationSettings {
  allNotifications: boolean;
  scheduleChanges: boolean;
  tripReminder: boolean;
  chatMessages: boolean;
  commentsAndMentions: boolean;
  voteResults: boolean;
  eventsAndBenefits: boolean;
}

export const defaultNotificationSettings: NotificationSettings = {
  allNotifications: true,
  scheduleChanges: true,
  tripReminder: true,
  chatMessages: true,
  commentsAndMentions: true,
  voteResults: false,
  eventsAndBenefits: false,
};

export const defaultProfileSettings: UserProfileSettings = {
  nickname: "예빈",
  email: "yebin5929@gmail.com",
  introduction: "안녕하세용!",
  avatar: "blue",
};

const unavailableNicknames = new Set(["도틀로", "dotlo", "관리자"]);

export function validateNickname(
  nickname: string,
  originalNickname = defaultProfileSettings.nickname,
): NicknameValidation {
  const value = nickname.trim();

  if (value === originalNickname) {
    return { valid: true, tone: "default", message: "" };
  }

  const validation = validateNicknameFormat(value);
  if (!validation.valid) return validation;

  if (unavailableNicknames.has(value.toLowerCase())) {
    return {
      valid: false,
      tone: "error",
      message: "이미 사용 중인 닉네임이에요",
    };
  }

  return validation;
}

export function validateNicknameFormat(nickname: string): NicknameValidation {
  const value = nickname.trim();

  if (value.length < 2 || value.length > 12) {
    return {
      valid: false,
      tone: "error",
      message: "닉네임은 2자 이상 12자 이하로 입력해 주세요",
    };
  }

  if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) {
    return {
      valid: false,
      tone: "error",
      message: "한글, 영문, 숫자만 입력할 수 있어요",
    };
  }

  return {
    valid: true,
    tone: "success",
    message: "사용할 수 있는 닉네임이에요",
  };
}

export function parseProfileSettings(raw: string | null): UserProfileSettings | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<UserProfileSettings>;
    if (
      typeof value.nickname !== "string" ||
      typeof value.email !== "string" ||
      typeof value.introduction !== "string" ||
      (value.avatar !== "blue" && value.avatar !== "purple")
    ) {
      return null;
    }

    return {
      nickname: value.nickname,
      email: value.email,
      introduction: value.introduction,
      avatar: value.avatar,
      ...(Array.isArray(value.travelPreferences) &&
      value.travelPreferences.every((preference) => typeof preference === "string")
        ? { travelPreferences: value.travelPreferences }
        : {}),
    };
  } catch {
    return null;
  }
}

export function readProfileSettings(storage: Storage): UserProfileSettings {
  return parseProfileSettings(storage.getItem(PROFILE_STORAGE_KEY)) ?? defaultProfileSettings;
}

export function saveProfileSettings(
  storage: Storage,
  profile: UserProfileSettings,
) {
  storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function parseNotificationSettings(
  raw: string | null,
): NotificationSettings | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<NotificationSettings>;
    const keys: (keyof NotificationSettings)[] = [
      "allNotifications",
      "scheduleChanges",
      "tripReminder",
      "chatMessages",
      "commentsAndMentions",
      "voteResults",
      "eventsAndBenefits",
    ];
    if (keys.some((key) => typeof value[key] !== "boolean")) return null;
    return value as NotificationSettings;
  } catch {
    return null;
  }
}

export function readNotificationSettings(storage: Storage): NotificationSettings {
  return (
    parseNotificationSettings(storage.getItem(NOTIFICATION_STORAGE_KEY)) ??
    defaultNotificationSettings
  );
}

export function saveNotificationSettings(
  storage: Storage,
  settings: NotificationSettings,
) {
  storage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(settings));
}

export function countEnabledNotifications(settings: NotificationSettings) {
  if (!settings.allNotifications) return 0;
  return Object.values(settings).filter(Boolean).length;
}

export interface GoogleMapsSettings {
  linked: boolean;
  autoImport: boolean;
  selectedListIds: string[];
}

export const defaultGoogleMapsSettings: GoogleMapsSettings = {
  linked: true,
  autoImport: true,
  selectedListIds: ["osaka-food", "tokyo-places", "kyoto-trip"],
};

export function parseGoogleMapsSettings(raw: string | null): GoogleMapsSettings | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<GoogleMapsSettings>;
    if (
      typeof value.linked !== "boolean" ||
      typeof value.autoImport !== "boolean" ||
      !Array.isArray(value.selectedListIds) ||
      value.selectedListIds.some((id) => typeof id !== "string")
    ) {
      return null;
    }
    return value as GoogleMapsSettings;
  } catch {
    return null;
  }
}

export function readGoogleMapsSettings(storage: Storage): GoogleMapsSettings {
  return (
    parseGoogleMapsSettings(storage.getItem(GOOGLE_MAPS_STORAGE_KEY)) ??
    defaultGoogleMapsSettings
  );
}

export function saveGoogleMapsSettings(
  storage: Storage,
  settings: GoogleMapsSettings,
) {
  storage.setItem(GOOGLE_MAPS_STORAGE_KEY, JSON.stringify(settings));
}

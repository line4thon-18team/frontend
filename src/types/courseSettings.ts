export type CourseSettingsSheet = "trip" | "invite" | "cover" | "duration";

export type CourseSettingsView = "menu" | "members" | "notifications";

export type CourseSettingsDialog = "clone" | "delete" | null;

export interface CourseSettingsMember {
  name: string;
  suffix: string;
  role: string;
  avatar: string;
}

export interface CourseSettingsShareTarget {
  label: string;
  image: string;
}

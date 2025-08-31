export type Level = 'infor' | 'incedent';
export const Levels = ['infor', 'incedent'];

export interface EmailNotification {
  email: string;
  level: Level;
}

export interface SlackNotification {
  slack: string;
  level: Level;
}

export type Notification = EmailNotification | SlackNotification;

export interface PingSetup {
  resource: string | null;
  timeout: number | null;
  responseCode: number | null;
  contentType: string | null;
  startTime: Date | null;
  period: number | null;
  incedentThreshold: number | null;
  recoveryThreshold: number | null;
  notificationChannels: Notification[] | null;
}

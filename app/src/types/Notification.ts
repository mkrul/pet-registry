export enum NotificationType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO"
}

export interface NotificationState {
  type: NotificationType;
  message: string;
}

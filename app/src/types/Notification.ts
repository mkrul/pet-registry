export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export interface NotificationState {
  type: NotificationType;
  message: string;
}

export enum NotificationType {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  INFO = "info"
}

export interface NotificationState {
  type: NotificationType;
  message: string;
}

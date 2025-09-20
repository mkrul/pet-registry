export enum NotificationType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO"
}

export interface NotificationState {
  type: NotificationType;
  message?: string;
}

export interface NotificationProps {
  type: NotificationType;
  message?: string;
  onClose: () => void;
}

export interface NotificationMessage {
  type: NotificationType;
  message: string;
}

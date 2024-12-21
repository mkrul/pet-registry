export type NotificationType = "success" | "warning" | "error" | "info";

export interface NotificationState {
  type: NotificationType;
  message: string;
}

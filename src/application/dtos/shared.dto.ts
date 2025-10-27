export interface CheckSessionAccessDTO {
  sessionId: string;
  userId?: string;
  psychId?: string;
}

export interface PostMessageDTO {
  sessionId: string;
  text: string;
  userId?: string;
  psychId?: string;
}

export interface GetMessagesDTO {
  sessionId: string;
}

export interface GetNotificationsDTO {
  recipientType: "admin" | "user" | "psychologist";
  recipientId: string;
  skip?: number;
  limit?: number;
}

export interface MarkNotificationsReadDTO {
  recipientType: "admin" | "user" | "psychologist";
  recipientId: string;
}
export interface GetUnreadNotificationsCountDTO {
  recipientType: "admin" | "user" | "psychologist";
  recipientId: string;
}

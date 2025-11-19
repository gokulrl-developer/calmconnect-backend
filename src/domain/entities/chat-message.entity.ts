export class ChatMessage {
  constructor(
      public sessionId: string,
      public senderId: string,
      public senderName:string,
      public text: string,
      public createdAt: Date = new Date(),
      public id?: string,
  ) {}
}
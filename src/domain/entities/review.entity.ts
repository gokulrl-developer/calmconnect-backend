export default class Review {
  constructor(
      public sessionId: string,
      public user: string,
      public psychologist: string,
      public rating: number, // 1 to 5
      public createdAt: Date,
      public id?: string,
      public comment?: string, //max 300 characters.
  ) {}
}
export default class Wallet {
  constructor(
      public ownerType: "user" | "psychologist" |"admin",
      public balance: number,
      public ownerId?: string,
      public id?:string
  ) {}
}

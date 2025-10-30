export default class Wallet {
  constructor(
      public ownerType: "user" | "psychologist" |"platform",
      public balance: number,
      public ownerId?: string,
      public id?:string
  ) {}
}

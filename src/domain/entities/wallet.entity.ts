import { WalletOwnerType } from "../enums/WalletOwnerType.js";

export default class Wallet {
  constructor(
      public ownerType: WalletOwnerType,
      public balance: number,
      public ownerId?: string,
      public id?:string
  ) {}
}

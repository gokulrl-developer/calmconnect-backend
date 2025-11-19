import Wallet from "../../domain/entities/wallet.entity.js";

export const toWalletDomain = (
  ownerType: "user" | "psychologist" | "platform",
  balance: number = 0,
  ownerId?: string
): Wallet => {
  return new Wallet(
    ownerType,
    balance,
    ownerId
  );
};

export const toFetchWalletResponse=(entity:Wallet)=>{
  return {
    ownerType:entity.ownerType,
    balance:entity.balance,
    walletId:entity.id!
  }
}

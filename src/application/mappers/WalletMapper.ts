import Wallet from "../../domain/entities/wallet.entity";

export const toWalletDomain = (
  ownerType: "user" | "psychologist" | "admin",
  balance: number = 0,
  ownerId?: string
): Wallet => {
  return new Wallet(
    ownerType,
    balance,
    ownerId
  );
};

import { GetWalletDTO } from "../dtos/shared.dto";


export interface WalletResponse {
  walletId: string;
  ownerType: "user" | "psychologist" | "platform";
  balance: number;
}

export default interface IFetchWalletUseCase {
  execute(dto: GetWalletDTO): Promise<WalletResponse>;
}

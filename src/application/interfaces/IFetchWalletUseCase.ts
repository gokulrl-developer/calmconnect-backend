import { WalletOwnerType } from "../../domain/enums/WalletOwnerType.js";
import { GetWalletDTO } from "../dtos/shared.dto.js";


export interface WalletResponse {
  walletId: string;
  ownerType:WalletOwnerType;
  balance: number;
}

export default interface IFetchWalletUseCase {
  execute(dto: GetWalletDTO): Promise<WalletResponse>;
}

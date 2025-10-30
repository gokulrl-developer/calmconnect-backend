import IFetchWalletUseCase, {
  WalletResponse,
} from "../interfaces/IFetchWalletUseCase";
import { GetWalletDTO } from "../dtos/shared.dto";
import { toFetchWalletResponse, toWalletDomain } from "../mappers/WalletMapper";
import IWalletRepository from "../../domain/interfaces/IWalletRepository";
import AppError from "../error/AppError";
import { ERROR_MESSAGES } from "../constants/error-messages.constants";
import { AppErrorCodes } from "../error/app-error-codes";

export default class FetchWalletUseCase implements IFetchWalletUseCase {
  constructor(
    private readonly _walletRepo: IWalletRepository
  ) {}

  async execute(dto: GetWalletDTO): Promise<WalletResponse> {
    const {ownerType,ownerId } = dto;

    let wallet = await this._walletRepo.findByOwner(ownerId,ownerType);
     if(!wallet){
          const walletEntity = toWalletDomain(dto.ownerType, 0,dto.ownerId);
          wallet = await this._walletRepo.create(walletEntity);
        }
    if (wallet.ownerId !== ownerId){
        throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACCESS,AppErrorCodes.FORBIDDEN_ERROR)
    }
      

    return toFetchWalletResponse(wallet)
  }
}

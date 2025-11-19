import IFetchWalletUseCase, {
  WalletResponse,
} from "../interfaces/IFetchWalletUseCase.js";
import { GetWalletDTO } from "../dtos/shared.dto.js";
import { toFetchWalletResponse, toWalletDomain } from "../mappers/WalletMapper.js";
import IWalletRepository from "../../domain/interfaces/IWalletRepository.js";
import AppError from "../error/AppError.js";
import { ERROR_MESSAGES } from "../constants/error-messages.constants.js";
import { AppErrorCodes } from "../error/app-error-codes.js";

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

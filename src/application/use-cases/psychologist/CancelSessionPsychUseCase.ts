import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository";
import IWalletRepository from "../../../domain/interfaces/IWalletRepository";
import Wallet from "../../../domain/entities/wallet.entity";
import {
  toDomainRefundDebit,
  toDomainRefundCredit,
} from "../../mappers/TransactionMapper";
import { CancelSessionDTO } from "../../dtos/psych.dto";
import AppError from "../../error/AppError";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import IAdminConfigService from "../../../domain/interfaces/IAdminConfigService";
import { toWalletDomain } from "../../mappers/WalletMapper";

export default class CancelSessionPsychUseCase {
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _adminConfigService: IAdminConfigService
  ) {}

  async execute(dto: CancelSessionDTO): Promise<void> {
    console.log(dto);
    const session = await this._sessionRepository.findById(dto.sessionId);
    if (!session)
      throw new AppError(
        ERROR_MESSAGES.SESSION_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );

    const { email: adminEmail, adminId } =
      this._adminConfigService.getAdminData();
    let platformWallet = await this._walletRepository.findOne({
      ownerType: "platform",
    });
    let userWallet = await this._walletRepository.findByOwner(
      session.user,
      "user"
    );
    if (!platformWallet) {
      platformWallet = await this._walletRepository.create(
        new Wallet("platform", 0, adminId)
      );
    }
    if (!userWallet) {
      const walletEntity = toWalletDomain("user", 0, session.user);
      userWallet = await this._walletRepository.create(walletEntity);
    }
    if (session.psychologist !== dto.psychId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORISED_ACTION,
        AppErrorCodes.FORBIDDEN_ERROR
      );
    }
    const debitFromPlatform = toDomainRefundDebit(
      platformWallet.id!,
      adminId,
      session.user,
      session.fees,
      session.id!
    );
    const creditToUser = toDomainRefundCredit(
      userWallet.id!,
      session.user,
      adminId,
      session.fees,
      session.id!
    );

    platformWallet.balance -= session.fees;
    await this._walletRepository.update(platformWallet.id!, platformWallet);

    const debitTx = await this._transactionRepository.create(debitFromPlatform);
    const creditTx = await this._transactionRepository.create(creditToUser);

    const transactions = [debitTx.id!, creditTx.id!];

    session.status = "cancelled";
    session.transactionIds = session.transactionIds
      ? [...session.transactionIds, ...transactions]
      : [...transactions];

    await this._sessionRepository.update(session.id!, session);
  }
}

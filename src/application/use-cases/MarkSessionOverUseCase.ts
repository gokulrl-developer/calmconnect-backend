import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { WalletOwnerType } from "../../domain/enums/WalletOwnerType.js";
import IAdminRepository from "../../domain/interfaces/IAdminRepository.js";
import ISessionRepository from "../../domain/interfaces/ISessionRepository.js";
import ITransactionRepository from "../../domain/interfaces/ITransactionRepository.js";
import IWalletRepository from "../../domain/interfaces/IWalletRepository.js";
import { ERROR_MESSAGES } from "../constants/error-messages.constants.js";
import IMarkSessionOverUseCase, {
  MarkSessionOverPayload,
} from "../interfaces/IMarkSessionOverUseCase.js";
import {
  toDomainPayoutCredit,
  toDomainPayoutDebit,
} from "../mappers/TransactionMapper.js";
import { toWalletDomain } from "../mappers/WalletMapper.js";

export default class MarkSessionOverUseCase implements IMarkSessionOverUseCase {
  constructor(
    private readonly _sessionRepo: ISessionRepository,
    private readonly _transactionRepo: ITransactionRepository,
    private readonly _walletRepo: IWalletRepository,
    private readonly _adminRepository: IAdminRepository
  ) {}

  async execute(payload: MarkSessionOverPayload): Promise<void> {
    const session = await this._sessionRepo.findById(payload.sessionId);

    if (!session) {
      throw new Error(ERROR_MESSAGES.SESSION_NOT_FOUND);
    }

    if (session.status !== SessionStatus.SCHEDULED) {
      return;
    }

    session.status = SessionStatus.ENDED;

    const adminData = await this._adminRepository.findOne();
    if (!adminData) {
      throw new Error(ERROR_MESSAGES.ADMIN_DATA_NOT_FOUND);
    }
    await this._sessionRepo.update(session.id!, session);
    let psychWallet = await this._walletRepo.findByOwner(
      session.psychologist,
      WalletOwnerType.PSYCHOLOGIST
    );
    const platformWallet = await this._walletRepo.findByOwner(
      adminData.adminId,
      WalletOwnerType.PLATFORM
    );
    if (!psychWallet) {
      const walletEntity = toWalletDomain(
        WalletOwnerType.PSYCHOLOGIST,
        0,
        session.psychologist
      );
      psychWallet = await this._walletRepo.create(walletEntity);
    }
    psychWallet.balance+=session.fees*.9;
    await this._walletRepo.update(psychWallet.id!, psychWallet);
    const transactionCredit = toDomainPayoutCredit(
      psychWallet.id!,
      session.psychologist,
      adminData.adminId,
      session.fees*0.9,
      session.id!
    );

    const transactionDebit = toDomainPayoutDebit(
      platformWallet!.id!,
      adminData.adminId!,
      session.psychologist,
      session.fees*0.9,
      session.id!
    );

    await this._transactionRepo.create(transactionCredit);
    await this._transactionRepo.create(transactionDebit);
    return;
  }
}

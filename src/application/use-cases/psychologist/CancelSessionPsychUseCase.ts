import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository.js";
import IWalletRepository from "../../../domain/interfaces/IWalletRepository.js";
import Wallet from "../../../domain/entities/wallet.entity.js";
import {
  toDomainRefundDebit,
  toDomainRefundCredit,
} from "../../mappers/TransactionMapper.js";
import { CancelSessionDTO } from "../../dtos/psych.dto.js";
import AppError from "../../error/AppError.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import { toWalletDomain } from "../../mappers/WalletMapper.js";
import { WalletOwnerType } from "../../../domain/enums/WalletOwnerType.js";
import { SessionStatus } from "../../../domain/enums/SessionStatus.js";
import IAdminRepository from "../../../domain/interfaces/IAdminRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { IEventBus } from "../../interfaces/events/IEventBus.js";
import { EventMapEvents } from "../../../domain/enums/EventMapEvents.js";

export default class CancelSessionPsychUseCase {
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _adminRepository: IAdminRepository,
    private readonly _psychRepository: IPsychRepository,
    private readonly _eventBus: IEventBus
  ) {}

  async execute(dto: CancelSessionDTO): Promise<void> {
    const session = await this._sessionRepository.findById(dto.sessionId);
    if (!session)
      throw new AppError(
        ERROR_MESSAGES.SESSION_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );

    const adminData = await this._adminRepository.findOne();
    if (!adminData) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        AppErrorCodes.INTERNAL_ERROR
      );
    }
    const { adminId } = adminData;
    let platformWallet = await this._walletRepository.findOne({
      ownerType: WalletOwnerType.PLATFORM,
    });
    let userWallet = await this._walletRepository.findByOwner(
      session.user,
      WalletOwnerType.USER
    );
    if (!platformWallet) {
      platformWallet = await this._walletRepository.create(
        new Wallet(WalletOwnerType.PLATFORM, 0, adminId)
      );
    }
    if (!userWallet) {
      const walletEntity = toWalletDomain(
        WalletOwnerType.USER,
        0,
        session.user
      );
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

    userWallet.balance += session.fees;
    await this._walletRepository.update(userWallet.id!, userWallet);
    const debitTx = await this._transactionRepository.create(debitFromPlatform);
    const creditTx = await this._transactionRepository.create(creditToUser);

    const transactions = [debitTx.id!, creditTx.id!];

    session.status = SessionStatus.CANCELLED;
    session.transactionIds = session.transactionIds
      ? [...session.transactionIds, ...transactions]
      : [...transactions];
    const psychologist = await this._psychRepository.findById(
      session.psychologist
    );
    if (!psychologist) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        AppErrorCodes.INTERNAL_ERROR
      );
    }
    const sessionStart = new Date(session.startTime);

    await this._eventBus.emit(EventMapEvents.PSYCHOLOGIST_CANCELLED_SESSION, {
      psychologistFullName: `${psychologist.firstName} ${psychologist.lastName}`,
      userId: session.user,
      date: `${sessionStart.getDate()}-${sessionStart.getMonth() + 1}-${sessionStart.getFullYear()}`,
      time: `${sessionStart.getHours().toString().padStart(2, "0")}:${sessionStart.getMinutes().toString().padStart(2, "0")}`,
    });
    await this._sessionRepository.update(session.id!, session);
  }
}

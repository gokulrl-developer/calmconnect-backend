import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository.js";
import IWalletRepository from "../../../domain/interfaces/IWalletRepository.js";
import Wallet from "../../../domain/entities/wallet.entity.js";
import {
  toDomainRefundDebit,
  toDomainRefundCredit,
  toDomainPayoutDebit,
  toDomainPayoutCredit,
} from "../../mappers/TransactionMapper.js";
import { CancelSessionDTO } from "../../dtos/user.dto.js";
import AppError from "../../error/AppError.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import ICancelSessionUserUseCase from "../../interfaces/ICancelSessionUserUseCase.js";
import { WalletOwnerType } from "../../../domain/enums/WalletOwnerType.js";
import { SessionStatus } from "../../../domain/enums/SessionStatus.js";
import IAdminRepository from "../../../domain/interfaces/IAdminRepository.js";
import { IEventBus } from "../../interfaces/events/IEventBus.js";
import { EventMapEvents } from "../../../domain/enums/EventMapEvents.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";

export default class CancelSessionUserUseCase
  implements ICancelSessionUserUseCase
{
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _adminRepository: IAdminRepository,
    private readonly _eventBus:IEventBus,
    private readonly _userRepository:IUserRepository
  ) {}

  async execute(dto: CancelSessionDTO): Promise<void> {
    const session = await this._sessionRepository.findById(dto.sessionId);
    if (!session)
      throw new AppError(
        ERROR_MESSAGES.SESSION_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );

    if (session.user !== dto.userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORISED_ACTION,
        AppErrorCodes.FORBIDDEN_ERROR
      );
    }
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const threeDaysBefore = new Date(sessionStart);
    threeDaysBefore.setDate(sessionStart.getDate() - 3);
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
    if (!platformWallet) {
      platformWallet = await this._walletRepository.create(
        new Wallet(WalletOwnerType.PLATFORM, 0, adminId)
      );
    }

    const transactions: string[] = [];

    if (now <= threeDaysBefore) {
      const debitFromPlatform = toDomainRefundDebit(
        platformWallet.walletId!,
        adminId,
        dto.userId,
        session.fees,
        session.sessionId!
      );
      const creditToUser = toDomainRefundCredit(
        dto.userId!,
        dto.userId,
        adminId,
        session.fees,
        session.sessionId!
      );

      platformWallet.balance -= session.fees;
      await this._walletRepository.update(platformWallet.walletId!, platformWallet);

      let userWallet = await this._walletRepository.findOne({
        ownerType: WalletOwnerType.USER,
      });
      if (!userWallet) {
        userWallet = await this._walletRepository.create(
          new Wallet(WalletOwnerType.USER, 0, session.user)
        );
      }
      userWallet.balance += session.fees;
      await this._walletRepository.update(userWallet.walletId!, userWallet);
      const debitTx =
        await this._transactionRepository.create(debitFromPlatform);
      const creditTx = await this._transactionRepository.create(creditToUser);

      transactions.push(debitTx.transactionId!, creditTx.transactionId!);
    } else {
      let psychWallet = await this._walletRepository.findOne({
        ownerType: WalletOwnerType.PSYCHOLOGIST,
        ownerId: session.psychologist,
      });

      if (!psychWallet) {
        psychWallet = await this._walletRepository.create(
          new Wallet(WalletOwnerType.PSYCHOLOGIST, 0, session.psychologist)
        );
      }

      const amountToPsych = session.fees * 0.9;

      const debitFromPlatform = toDomainPayoutDebit(
        platformWallet.walletId!,
        adminId,
        session.psychologist,
        amountToPsych,
        session.sessionId!
      );
      const creditToPsych = toDomainPayoutCredit(
        psychWallet.walletId!,
        session.psychologist,
        adminId,
        amountToPsych,
        session.sessionId!
      );

      platformWallet.balance -= amountToPsych;
      psychWallet.balance += amountToPsych;

      await Promise.all([
        this._walletRepository.update(platformWallet.walletId!, platformWallet),
        this._walletRepository.update(psychWallet.walletId!, psychWallet),
      ]);

      const debitTx =
        await this._transactionRepository.create(debitFromPlatform);
      const creditTx = await this._transactionRepository.create(creditToPsych);

      transactions.push(debitTx.transactionId!, creditTx.transactionId!);
    }

    session.status = SessionStatus.CANCELLED;
    session.transactionIds = session.transactionIds
      ? [...session.transactionIds, ...transactions]
      : [...transactions];

    const user=await this._userRepository.findById(session.user);
    if(!user){
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR)
    }
    await this._eventBus.emit(EventMapEvents.USER_CANCELLED_SESSION, {
      userFullName: `${user.firstName} ${user.lastName}`,
      psychologistId: session.psychologist,
      date:`${sessionStart.getDate()}-${sessionStart.getMonth() + 1}-${sessionStart.getFullYear()}`,
      time:`${sessionStart.getHours().toString().padStart(2, '0')}:${sessionStart.getMinutes().toString().padStart(2, '0')}`
    });
    await this._sessionRepository.update(session.sessionId!, session);
  }
}

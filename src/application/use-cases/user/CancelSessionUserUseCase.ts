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

export default class CancelSessionUserUseCase implements ICancelSessionUserUseCase{
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _adminRepository:IAdminRepository
  ) {}

  async execute(dto: CancelSessionDTO): Promise<void> {
    const session = await this._sessionRepository.findById(dto.sessionId);
    if (!session)
      throw new AppError(ERROR_MESSAGES.SESSION_NOT_FOUND, AppErrorCodes.NOT_FOUND);

    if(session.user !== dto.userId){
            throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION,AppErrorCodes.FORBIDDEN_ERROR)
        }
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const threeDaysBefore = new Date(sessionStart);
    threeDaysBefore.setDate(sessionStart.getDate() - 3);
    const adminData=await this._adminRepository.findOne();
        if(!adminData){
          throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR)
        }
    const {adminId}=adminData
    let platformWallet = await this._walletRepository.findOne({ ownerType: WalletOwnerType.PLATFORM });
    if (!platformWallet) {
      platformWallet = await this._walletRepository.create(new Wallet(WalletOwnerType.PLATFORM, 0,adminId));
    }

    const transactions: string[] = [];
  
    if (now <= threeDaysBefore) {
      const debitFromPlatform = toDomainRefundDebit(platformWallet.id!,adminId,dto.userId, session.fees, session.id!);
      const creditToUser = toDomainRefundCredit(dto.userId!,dto.userId,adminId, session.fees, session.id!);

      platformWallet.balance -= session.fees;
      await this._walletRepository.update(platformWallet.id!, platformWallet);

      let userWallet = await this._walletRepository.findOne({ ownerType: WalletOwnerType.USER });
    if (!userWallet) {
      userWallet = await this._walletRepository.create(new Wallet(WalletOwnerType.USER, 0,session.user));
    }
      userWallet.balance+=session.fees;
      await this._walletRepository.update(userWallet.id!, userWallet);
      const debitTx = await this._transactionRepository.create(debitFromPlatform);
      const creditTx = await this._transactionRepository.create(creditToUser);

      transactions.push(debitTx.id!, creditTx.id!);
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

      const debitFromPlatform = toDomainPayoutDebit(platformWallet.id!,adminId,session.psychologist, amountToPsych, session.id!);
      const creditToPsych = toDomainPayoutCredit(psychWallet.id!,session.psychologist,adminId, amountToPsych, session.id!);

      platformWallet.balance -= amountToPsych;
      psychWallet.balance += amountToPsych;

      await Promise.all([
        this._walletRepository.update(platformWallet.id!, platformWallet),
        this._walletRepository.update(psychWallet.id!, psychWallet),
      ]);

      const debitTx = await this._transactionRepository.create(debitFromPlatform);
      const creditTx = await this._transactionRepository.create(creditToPsych);

      transactions.push(debitTx.id!, creditTx.id!);
    }

    session.status = SessionStatus.CANCELLED;
    session.transactionIds = session.transactionIds
      ? [...session.transactionIds, ...transactions]
      : [...transactions];

    await this._sessionRepository.update(session.id!, session);
  }
}

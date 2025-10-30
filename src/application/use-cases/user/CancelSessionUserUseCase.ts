import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository";
import IWalletRepository from "../../../domain/interfaces/IWalletRepository";
import Wallet from "../../../domain/entities/wallet.entity";
import {
  toDomainRefundDebit,
  toDomainRefundCredit,
  toDomainPayoutDebit,
  toDomainPayoutCredit,
} from "../../mappers/TransactionMapper";
import { CancelSessionDTO } from "../../dtos/user.dto";
import AppError from "../../error/AppError";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import ICancelSessionUserUseCase from "../../interfaces/ICancelSessionUserUseCase";
import IAdminConfigService from "../../../domain/interfaces/IAdminConfigService";

export default class CancelSessionUserUseCase implements ICancelSessionUserUseCase{
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _adminConfigService:IAdminConfigService
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
    
    const {email:adminEmail,adminId}=this._adminConfigService.getAdminData();

    let platformWallet = await this._walletRepository.findOne({ ownerType: "platform" });
    if (!platformWallet) {
      platformWallet = await this._walletRepository.create(new Wallet("platform", 0,adminId));
    }

    let transactions: string[] = [];
  
    if (now <= threeDaysBefore) {
      const debitFromPlatform = toDomainRefundDebit(platformWallet.id!,adminId,dto.userId, session.fees, session.id!);
      const creditToUser = toDomainRefundCredit(dto.userId!,dto.userId,adminId, session.fees, session.id!);

      platformWallet.balance -= session.fees;
      await this._walletRepository.update(platformWallet.id!, platformWallet);

      const debitTx = await this._transactionRepository.create(debitFromPlatform);
      const creditTx = await this._transactionRepository.create(creditToUser);

      transactions.push(debitTx.id!, creditTx.id!);
    } else {
      let psychWallet = await this._walletRepository.findOne({
        ownerType: "psychologist",
        ownerId: session.psychologist,
      });

      if (!psychWallet) {
        psychWallet = await this._walletRepository.create(
          new Wallet("psychologist", 0, session.psychologist)
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

    session.status = "cancelled";
    session.transactionIds = session.transactionIds
      ? [...session.transactionIds, ...transactions]
      : [...transactions];

    await this._sessionRepository.update(session.id!, session);
  }
}

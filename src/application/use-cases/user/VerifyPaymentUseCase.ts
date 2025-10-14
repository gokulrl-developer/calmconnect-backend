import {VerifyPaymentDTO} from "../../dtos/user.dto";
import Transaction from "../../../domain/entities/transaction.entity";
import Wallet from "../../../domain/entities/wallet.entity";
import IPaymentProvider from "../../../domain/interfaces/IPaymentProvider";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository";
import IWalletRepository from "../../../domain/interfaces/IWalletRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IVerifyPaymentUseCase, {
  VerifyPaymentResponse,
} from "../../interfaces/IVerifyPaymentUseCase";
import {
  toDomainBookingCredit,
  toDomainBookingDebit,
} from "../../mappers/TransactionMapper";
import { toWalletDomain } from "../../mappers/WalletMapper";

export default class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private readonly _paymentProvider: IPaymentProvider,
    private readonly _sessionRepository: ISessionRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: VerifyPaymentDTO): Promise<VerifyPaymentResponse> {
    const { sessionId, userId, ...verifyPaymentInput } = dto;
    const verificationResult = await this._paymentProvider.verifyPayment(
      verifyPaymentInput
    );

    if (!verificationResult.success) {
      return { success: false };
    }

    const session = await this._sessionRepository.findById(dto.sessionId);

    if (!session || session.status!=="pending") {
      throw new AppError(
        ERROR_MESSAGES.SESSION_UNAVAILABLE,
        AppErrorCodes.NOT_FOUND
      );
    }

    let platformWallet = await this._walletRepository.findOne({
      ownerType: "admin",
    });
    if (!platformWallet) {
      const walletEntity = toWalletDomain("admin", verificationResult.amount!)
      platformWallet = await this._walletRepository.create(walletEntity);
    } else {
      platformWallet.balance =
      platformWallet.balance + verificationResult.amount!;
    }
    await this._walletRepository.update(platformWallet.id!, platformWallet);
    
    const transactionCredit = toDomainBookingCredit(
      platformWallet.id!,
      verificationResult.amount!,
      session.id!,
      dto.providerPaymentId
    );
    
    const transactionDebit = toDomainBookingDebit(
      dto.userId!,
      verificationResult.amount!,
      session.id!,
      dto.providerPaymentId
    );
    
    const creditTransaction=await this._transactionRepository.create(transactionCredit);
    const debitTransaction=await this._transactionRepository.create(transactionDebit);
    const transactionIds=[creditTransaction.id,debitTransaction.id]
    session.status="scheduled";
    session.transactionIds=transactionIds as string[]
    await this._sessionRepository.update(session.id!, session);
    return { success: true };
  }
}

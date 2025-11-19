import { VerifyPaymentDTO } from "../../dtos/user.dto.js";
import IPaymentProvider from "../../../domain/interfaces/IPaymentProvider.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository.js";
import IWalletRepository from "../../../domain/interfaces/IWalletRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IVerifyPaymentUseCase, { VerifyPaymentResponse } from "../../interfaces/IVerifyPaymentUseCase.js";
import { toDomainBookingCredit, toDomainBookingDebit } from "../../mappers/TransactionMapper.js";
import { toWalletDomain } from "../../mappers/WalletMapper.js";
import { IEventBus } from "../../interfaces/events/IEventBus.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { ISessionTaskQueue } from "../../../domain/interfaces/ISessionTaskQueue.js";
import IAdminConfigService from "../../../domain/interfaces/IAdminConfigService.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";

export default class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private readonly _paymentProvider: IPaymentProvider,
    private readonly _sessionRepository: ISessionRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _sessionTaskQueue: ISessionTaskQueue,
    private readonly _eventBus: IEventBus,
    private readonly _adminConfigService:IAdminConfigService,
    private readonly _psychRepository:IPsychRepository
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

    if (!session || session.status !== "pending") {
      throw new AppError(
        ERROR_MESSAGES.SESSION_UNAVAILABLE,
        AppErrorCodes.NOT_FOUND
      );
    }

    const adminData=this._adminConfigService.getAdminData();
    let platformWallet = await this._walletRepository.findByOwner(adminData.adminId,"platform")
    let userWallet = await this._walletRepository.findByOwner(dto.userId,"user");
    if (!platformWallet) {
      const walletEntity = toWalletDomain("platform", verificationResult.amount!/100,adminData.adminId);
      platformWallet = await this._walletRepository.create(walletEntity);
    } else {
      platformWallet.balance =
        platformWallet.balance + verificationResult.amount!;
    }
    await this._walletRepository.update(platformWallet.id!, platformWallet);

    if(!userWallet){
      const walletEntity = toWalletDomain("user", 0,dto.userId);
      userWallet = await this._walletRepository.create(walletEntity);
    }

    const transactionCredit = toDomainBookingCredit(
      platformWallet.id!,
      adminData.adminId,
      dto.userId,
      verificationResult.amount!/100,
      session.id!,
      dto.providerPaymentId
    );

    const transactionDebit = toDomainBookingDebit(
      userWallet.id!,
      dto.userId!,
      adminData.adminId,
      verificationResult.amount!/100,
      session.id!,
      dto.providerPaymentId
    );

    const creditTransaction = await this._transactionRepository.create(
      transactionCredit
    );
    const debitTransaction = await this._transactionRepository.create(
      transactionDebit
    );
    const transactionIds = [creditTransaction.id, debitTransaction.id];
    session.status = "scheduled";
    session.transactionIds = transactionIds as string[];
    await this._sessionRepository.update(session.id!, session);

    const user = await this._userRepository.findById(session.user);

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    await this._eventBus.emit("session.created", {
      userFullName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      psychologistId: session.psychologist,
    });
    const startTimestamp = new Date(session.startTime).getTime();
    const endTimestamp = new Date(session.endTime).getTime();
    const now = Date.now();

    const reminders = [
      { minutes: 30, event: "session-reminder.30min" },
      { minutes: 5, event: "session-reminder.5min" },
    ];
   const psychologist=await this._psychRepository.findById(session.psychologist);
   if (!psychologist) {
      throw new Error(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND);
    }
    for (const { minutes, event } of reminders) {
      const delay = startTimestamp - now - minutes * 60 * 1000;

      if (delay > 0) {
        await this._sessionTaskQueue.add(
          event as "session-reminder.30min" | "session-reminder.5min",
          {
            recipientType: "psychologist",
            recipientId: session.psychologist,
            sessionId,
            minutes,
            userEmail:user.email,
            psychEmail:psychologist.email,
            userFullName:`${user.firstName} ${user.lastName}`,
            psychFullName:`${psychologist.firstName} ${psychologist.lastName}`,
            startTime:session.startTime.toISOString()
          },
          delay
        );
        await this._sessionTaskQueue.add(
          event as "session-reminder.30min" | "session-reminder.5min",
          {
            recipientType: "user",
            recipientId: userId,
            sessionId,
            minutes,
            userEmail:user.email,
            psychEmail:psychologist.email,
            userFullName:`${user.firstName} ${user.lastName}`,
            psychFullName:`${psychologist.firstName} ${psychologist.lastName}`,
            startTime:session.startTime.toISOString()
          },
          delay
        );
      }
    }
    const endDelay = endTimestamp - now;
    if (endDelay > 0) {
      await this._sessionTaskQueue.add(
        "session-over",
        {
          recipientType: "psychologist",
          recipientId: session.psychologist,
          sessionId,
        },
        endDelay
      );
      await this._sessionTaskQueue.add(
        "session-over",
        {
          recipientType: "user",
          recipientId: userId,
          sessionId,
        },
        endDelay
      );
    }
    return { success: true };
  }
}

import ISessionRepository from "../../domain/interfaces/ISessionRepository";
import ITransactionRepository from "../../domain/interfaces/ITransactionRepository";
import IWalletRepository from "../../domain/interfaces/IWalletRepository";
import { adminConfig } from "../../utils/adminConfig";
import { ERROR_MESSAGES } from "../constants/error-messages.constants";
import IMarkSessionOverUseCase, {
  MarkSessionOverPayload,
} from "../interfaces/IMarkSessionOverUseCase";
import { toDomainPayoutCredit, toDomainPayoutDebit } from "../mappers/TransactionMapper";
import { toWalletDomain } from "../mappers/WalletMapper";

export default class MarkSessionOverUseCase implements IMarkSessionOverUseCase {
  constructor(
    private readonly _sessionRepo: ISessionRepository,
    private readonly _transactionRepo: ITransactionRepository,
    private readonly _walletRepo: IWalletRepository
  ) {}

  async execute(payload: MarkSessionOverPayload): Promise<void> {
    const session = await this._sessionRepo.findById(payload.sessionId);

    if (!session) {
      throw new Error(ERROR_MESSAGES.SESSION_NOT_FOUND);
    }

    if (session.status !== "scheduled") {
      return;
    }

    session.status = "ended";

    const adminData=adminConfig;
    await this._sessionRepo.update(session.id!, session);
    let psychWallet = await this._walletRepo.findByOwner(
      session.psychologist,
      "psychologist"
    );
    let platformWallet = await this._walletRepo.findByOwner(
      adminData.adminId,
      "platform"
    );
    if (!psychWallet) {
      const walletEntity = toWalletDomain(
        "psychologist",
        0,
        session.psychologist
      );
      psychWallet = await this._walletRepo.create(walletEntity);
    }
     const transactionCredit = toDomainPayoutCredit(
          psychWallet.id!,
          session.psychologist,
          adminData.adminId,
          session.fees,
          session.id!
        );
    
        const transactionDebit = toDomainPayoutDebit(
          platformWallet!.id!,
          adminData.adminId!,
          session.psychologist,
          session.fees,
          session.id!
        );
    
        const creditTransaction = await this._transactionRepo.create(
          transactionCredit
        );
        const debitTransaction = await this._transactionRepo.create(
          transactionDebit
        );
    return;
  }
}

import IGenerateTransactionReceiptUseCase from "../interfaces/IGenerateTransactionReceiptUseCase.js";
import { GetTransactionReceiptDTO } from "../dtos/shared.dto.js";
import ITransactionRepository from "../../domain/interfaces/ITransactionRepository.js";
import { IReceiptService, RecipientData, SourceData } from "../../domain/interfaces/IReceiptService.js";
import AppError from "../error/AppError.js";
import { ERROR_MESSAGES } from "../constants/error-messages.constants.js";
import { AppErrorCodes } from "../error/app-error-codes.js";
import IUserRepository from "../../domain/interfaces/IUserRepository.js";
import IPsychRepository from "../../domain/interfaces/IPsychRepository.js";


export default class GenerateTransactionReceiptUseCase
  implements IGenerateTransactionReceiptUseCase
{
  constructor(
    private readonly _transactionRepo: ITransactionRepository,
    private readonly _receiptService: IReceiptService,
    private readonly _userRepository: IUserRepository,
    private readonly _psychRepository: IPsychRepository,
  ) {}

  async execute(dto: GetTransactionReceiptDTO): Promise<Buffer> {
    const { ownerId,transactionId } = dto;

    const transaction = await this._transactionRepo.findById(transactionId);
    if (!transaction) {
        throw new AppError(ERROR_MESSAGES.TRANSACTION_NOT_FOUND,AppErrorCodes.NOT_FOUND)
    };

    if (transaction?.ownerId!==ownerId){
        throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACCESS,AppErrorCodes.FORBIDDEN_ERROR)
    }
    let sourceData:SourceData|undefined;
    if (transaction.sourceType === "user") {
      const user = await this._userRepository.findById(transaction.sourceId);
      if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, AppErrorCodes.NOT_FOUND);
      }
      sourceData= {
        type: "user",
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };
    }

    if (transaction.sourceType === "psychologist") {
      const psych = await this._psychRepository.findById(transaction.sourceId);
      if (!psych) {
        throw new AppError(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND, AppErrorCodes.NOT_FOUND);
      }
      sourceData= {
        type: "psychologist",
        name: `${psych.firstName} ${psych.lastName}`,
        email: psych.email,
      };
    }

    if (transaction.sourceType === "platform") {
      sourceData= {
        type: "platform",
      };
    }

    let recipientData:RecipientData|undefined;
    if (transaction.recipientType === "user") {
      const user = await this._userRepository.findById(transaction.recipientId);
      if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, AppErrorCodes.NOT_FOUND);
      }
      recipientData = {
        type: "user",
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };
    } else if (transaction.recipientType === "psychologist") {
      const psych = await this._psychRepository.findById(transaction.recipientId);
      if (!psych) {
        throw new AppError(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND, AppErrorCodes.NOT_FOUND);
      }
      recipientData = {
        type: "psychologist",
        name: `${psych.firstName} ${psych.lastName}`,
        email: psych.email,
      };
    } else {
      recipientData = { type: "platform" };
    }

    return this._receiptService.generateTransactionReceipt(transaction,sourceData!,recipientData!);
  }
}

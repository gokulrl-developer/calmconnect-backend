import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import IFetchWalletUseCase from "../../../application/interfaces/IFetchWalletUseCase.js";
import IGenerateTransactionReceiptUseCase from "../../../application/interfaces/IGenerateTransactionReceiptUseCase.js";
import {
  GetTransactionsDTO,
  GetWalletDTO,
  GetTransactionReceiptDTO,
} from "../../../application/dtos/shared.dto.js";
import AppError from "../../../application/error/AppError.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";
import ITransactionListUseCase from "../../../application/interfaces/IFetchTransactionsUseCase.js";
import { REGEX_EXP } from "../../constants/regex.constants.js";

export default class FinanceController {
  constructor(
    private _transactionListUseCase: ITransactionListUseCase,
    private _fetchWalletUseCase: IFetchWalletUseCase,
    private _generateTransactionReceiptUseCase: IGenerateTransactionReceiptUseCase
  ) {}

  async listTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.account) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      if (!req.pagination) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      const { type, date, referenceType } = req.query;
      if (
        type &&
        (typeof type !== "string" ||
          ["debit", "credit"].includes(type) === false)
      ) {
        throw new AppError(
          ERROR_MESSAGES.TRANSACTION_TYPE_INVALID_FORMAT,
          AppErrorCodes.INVALID_INPUT
        );
      }
      if (
        date &&
        (typeof date !== "string" || REGEX_EXP.ISO_DATE.test(date) === false)
      ) {
        throw new AppError(
          ERROR_MESSAGES.TRANSACTION_DATE_INVALID_FORMAT,
          AppErrorCodes.INVALID_INPUT
        );
      }
      if (
        referenceType &&
        (typeof referenceType !== "string" ||
          ["booking", "psychologistPayment", "refund"].includes(
            referenceType
          ) === false)
      ) {
        throw new AppError(
          ERROR_MESSAGES.TRANSACTION_REFERENCE_TYPE_INVALID_FORMAT,
          AppErrorCodes.INVALID_INPUT
        );
      }
      const dto: GetTransactionsDTO = {
        ownerType: "psychologist",
        ownerId: req.account.id!,
        skip: req.pagination.skip,
        limit: req.pagination.limit,
        type: type as "debit" | "credit",
        date: date,
        referenceType: referenceType as
          | "booking"
          | "psychologistPayment"
          | "refund",
      };

      const result = await this._transactionListUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ ...result });
    } catch (error) {
      next(error);
    }
  }

  async fetchWallet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.account) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      const dto: GetWalletDTO = {
        ownerType: "psychologist",
        ownerId: req.account.id!,
      };

      const wallet = await this._fetchWalletUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ wallet });
    } catch (error) {
      next(error);
    }
  }

  async generateTransactionReceipt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.account) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }

      const transactionId = req.params.transactionId;
      if (!transactionId) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: GetTransactionReceiptDTO = {
        ownerType: "psychologist",
        ownerId: req.account.id!,
        transactionId,
      };

      const pdfBuffer =
        await this._generateTransactionReceiptUseCase.execute(dto);

      res
        .status(StatusCodes.OK)
        .set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=transaction-#${transactionId.split("").slice(-4).join("")}.pdf`,
        })
        .send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}

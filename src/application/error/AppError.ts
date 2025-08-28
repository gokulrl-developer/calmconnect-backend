import {AppErrorCodes} from "./app-error-codes";

export default class AppError extends Error {
  constructor(
    message: string,
    public code:AppErrorCodes
  ) {
    super(message);

  }
}

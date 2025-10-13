import { Request, Response, NextFunction } from "express";
import ICreateAvailabilityRuleUseCase from "../../../application/interfaces/ICreateAvailabilityRuleUseCase";
import IEditAvailabilityRuleUseCase from "../../../application/interfaces/IEditAvailabilityRuleUseCase";
import IDeleteAvailabilityRuleUseCase from "../../../application/interfaces/IDeleteAvailabilityRuleUseCase";
import ICreateSpecialDayUseCase from "../../../application/interfaces/ICreateSpecialDayUseCase";
import IEditSpecialDayUseCase from "../../../application/interfaces/IEditSpecialDayUseCase";
import IDeleteSpecialDayUseCase from "../../../application/interfaces/IDeleteSpecialDayUseCase";
import ICreateQuickSlotUseCase from "../../../application/interfaces/ICreateQuickSlotUseCase";
import IEditQuickSlotUseCase from "../../../application/interfaces/IEditQuickSlotUseCase";
import IDeleteQuickSlotUseCase from "../../../application/interfaces/IDeleteQuickSlotUseCase";
import IFetchAvailabilityRuleUseCase from "../../../application/interfaces/IFetchAvailabilityRuleUseCase";
import IFetchDailyAvailabilityUseCase from "../../../application/interfaces/IFetchDailyAvailabilityUseCase";
import IListAvailabilityRulesUseCase from "../../../application/interfaces/IListAvailabilityRulesUseCase";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { StatusCodes } from "../../../utils/http-statuscodes";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import { REGEX_EXP } from "../../constants/regex.constants";

export default class AvailabilityController {
  constructor(
    private readonly _createAvailabilityRuleUseCase: ICreateAvailabilityRuleUseCase,
    private readonly _editAvailabilityRuleUseCase: IEditAvailabilityRuleUseCase,
    private readonly _deleteAvailabilityRuleUseCase: IDeleteAvailabilityRuleUseCase,
    private readonly _createSpecialDayUseCase: ICreateSpecialDayUseCase,
    private readonly _editSpecialDayUseCase: IEditSpecialDayUseCase,
    private readonly _deleteSpecialDayUseCase: IDeleteSpecialDayUseCase,
    private readonly _createQuickSlotUseCase: ICreateQuickSlotUseCase,
    private readonly _editQuickSlotUseCase: IEditQuickSlotUseCase,
    private readonly _deleteQuickSlotUseCase: IDeleteQuickSlotUseCase,
    private readonly _fetchAvailabilityRuleUseCase: IFetchAvailabilityRuleUseCase,
    private readonly _fetchDailyAvailabilityUseCase: IFetchDailyAvailabilityUseCase,
    private readonly _listAvailabilityRuleUseCase: IListAvailabilityRulesUseCase
  ) {}

  async createAvailabilityRule(req: Request, res: Response, next: NextFunction) {
    try {
      const psychId = req.account?.id;
      const { weekDay, startTime, endTime, durationInMins, bufferTimeInMins } = req.body;

      if (psychId === undefined) throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION, AppErrorCodes.FORBIDDEN_ERROR);
      if (weekDay === undefined || weekDay < 0 || weekDay > 6) throw new AppError(ERROR_MESSAGES.INVALID_FIELDS, AppErrorCodes.VALIDATION_ERROR);
      if (!startTime || typeof startTime !== "string" || !REGEX_EXP.HHMM_TIME.test(startTime)) throw new AppError(ERROR_MESSAGES.START_TIME_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
      if (!endTime || typeof endTime !== "string" || !REGEX_EXP.HHMM_TIME.test(endTime)) throw new AppError(ERROR_MESSAGES.END_TIME_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
      if (typeof durationInMins !== "number" || durationInMins <= 0) throw new AppError(ERROR_MESSAGES.DURATION_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
      if (bufferTimeInMins !== undefined && typeof bufferTimeInMins !== "number") throw new AppError(ERROR_MESSAGES.BUFFER_TIME_INVALID, AppErrorCodes.VALIDATION_ERROR);
      await this._createAvailabilityRuleUseCase.execute({ psychId, weekDay, startTime, endTime, durationInMins, bufferTimeInMins });

      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.AVAILABILITY_RULE_CREATED });
    } catch (error) {
      next(error);
    }
  }


 async editAvailabilityRule(req: Request, res: Response, next: NextFunction) {
  try {
    const psychId = req.account?.id;
    const { availabilityRuleId } = req.params; 
    const { startTime, endTime, durationInMins, bufferTimeInMins, status } = req.body;

    if (!availabilityRuleId || typeof availabilityRuleId !== "string"){
      throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_ID_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
    }
    if (startTime && !REGEX_EXP.HHMM_TIME.test(startTime))
      throw new AppError(ERROR_MESSAGES.START_TIME_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
    if (endTime && !REGEX_EXP.HHMM_TIME.test(endTime))
      throw new AppError(ERROR_MESSAGES.END_TIME_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
    if (durationInMins !== undefined && (typeof durationInMins !== "number" || durationInMins <= 0))
      throw new AppError(ERROR_MESSAGES.DURATION_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
    if (bufferTimeInMins !== undefined && typeof bufferTimeInMins !== "number")
      throw new AppError(ERROR_MESSAGES.BUFFER_TIME_INVALID, AppErrorCodes.VALIDATION_ERROR);
    if (status !== undefined && !["active", "inactive"].includes(status))
      throw new AppError(ERROR_MESSAGES.INVALID_FIELDS, AppErrorCodes.VALIDATION_ERROR);

    await this._editAvailabilityRuleUseCase.execute({
      psychId: psychId!,
      availabilityRuleId,
      startTime,
      endTime,
      durationInMins,
      bufferTimeInMins,
      status,
    });

    res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.AVAILABILITY_RULE_EDITED });
  } catch (error) {
    next(error);
  }
}

 async deleteAvailabilityRule(req: Request, res: Response, next: NextFunction) {
  try {
    const psychId = req.account?.id;
    const { availabilityRuleId } = req.params; 

    if (!availabilityRuleId || typeof availabilityRuleId !== "string")
      throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_ID_REQUIRED, AppErrorCodes.VALIDATION_ERROR);

    await this._deleteAvailabilityRuleUseCase.execute({ psychId: psychId!, availabilityRuleId });

    res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.AVAILABILITY_RULE_DELETED });
  } catch (error) {
    next(error);
  }
}


  async createSpecialDay(req: Request, res: Response, next: NextFunction) {
    try {
      const psychId = req.account?.id;
      const { date, type, startTime, endTime, durationInMins, bufferTimeInMins } = req.body;

      if (!date || typeof date !== "string" || !REGEX_EXP.ISO_DATE.test(date)) throw new AppError(ERROR_MESSAGES.DATE_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
      if (!["override", "absent"].includes(type)) throw new AppError(ERROR_MESSAGES.INVALID_FIELDS, AppErrorCodes.VALIDATION_ERROR);

      await this._createSpecialDayUseCase.execute({ psychId: psychId!, date: new Date(date), type, startTime, endTime, durationInMins, bufferTimeInMins });

      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.SPECIAL_DAY_CREATED });
    } catch (error) {
      next(error);
    }
  }

 async editSpecialDay(req: Request, res: Response, next: NextFunction) {
  try {
    const psychId = req.account?.id;
    const { specialDayId } = req.params;
    const { type, startTime, endTime, durationInMins, bufferTimeInMins, status } = req.body;

    if (!specialDayId || typeof specialDayId !== "string")
      throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
    if (type && !["override", "absent"].includes(type))
      throw new AppError(ERROR_MESSAGES.INVALID_FIELDS, AppErrorCodes.VALIDATION_ERROR);
    if (status && !["active", "inactive"].includes(status))
      throw new AppError(ERROR_MESSAGES.INVALID_FIELDS, AppErrorCodes.VALIDATION_ERROR);

    await this._editSpecialDayUseCase.execute({ psychId: psychId!, specialDayId, type, startTime, endTime, durationInMins, bufferTimeInMins, status });

    res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.SPECIAL_DAY_EDITED });
  } catch (error) {
    next(error);
  }
}


 async deleteSpecialDay(req: Request, res: Response, next: NextFunction) {
  try {
    const psychId = req.account?.id;
    const { specialDayId } = req.params;

    if (!specialDayId || typeof specialDayId !== "string")
      throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);

    await this._deleteSpecialDayUseCase.execute({ psychId: psychId!, specialDayId });

    res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.SPECIAL_DAY_DELETED });
  } catch (error) {
    next(error);
  }
}



  async createQuickSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const psychId = req.account?.id;
      const { date, startTime, endTime, durationInMins, bufferTimeInMins } = req.body;

      if (!date || typeof date !== "string" || !REGEX_EXP.ISO_DATE.test(date)) throw new AppError(ERROR_MESSAGES.DATE_REQUIRED, AppErrorCodes.VALIDATION_ERROR);

      await this._createQuickSlotUseCase.execute({ psychId: psychId!, date: new Date(date), startTime, endTime, durationInMins, bufferTimeInMins });

      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.QUICK_SLOT_CREATED });
    } catch (error) {
      next(error);
    }
  }

 async editQuickSlot(req: Request, res: Response, next: NextFunction) {
  try {
    const psychId = req.account?.id;
    const { quickSlotId } = req.params;
    const { startTime, endTime, durationInMins, bufferTimeInMins, status } = req.body;

    if (!quickSlotId || typeof quickSlotId !== "string")
      throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
    if (status && !["active", "inactive"].includes(status))
      throw new AppError(ERROR_MESSAGES.INVALID_FIELDS, AppErrorCodes.VALIDATION_ERROR);

    await this._editQuickSlotUseCase.execute({ psychId: psychId!, quickSlotId, startTime, endTime, durationInMins, bufferTimeInMins, status });

    res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.QUICK_SLOT_EDITED });
  } catch (error) {
    next(error);
  }
}

 async deleteQuickSlot(req: Request, res: Response, next: NextFunction) {
  try {
    const psychId = req.account?.id;
    const { quickSlotId } = req.params;

    if (!quickSlotId || typeof quickSlotId !== "string")
      throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);

    await this._deleteQuickSlotUseCase.execute({ psychId: psychId!, quickSlotId });

    res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.QUICK_SLOT_DELETED });
  } catch (error) {
    next(error);
  }
}

  async fetchAvailabilityRule(req: Request, res: Response, next: NextFunction) {
    try {
      const psychId = req.account?.id;
      const { availabilityRuleId } = req.query;

      if (!availabilityRuleId || typeof availabilityRuleId !== "string") throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_ID_REQUIRED, AppErrorCodes.VALIDATION_ERROR);

      const availabilityRule = await this._fetchAvailabilityRuleUseCase.execute({ psychId: psychId!, availabilityRuleId: availabilityRuleId as string });

      res.status(StatusCodes.OK).json({ availabilityRule });
    } catch (error) {
      next(error);
    }
  }

  async fetchDailyAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const psychId = req.account?.id;
      const { date } = req.query;

      if (!date || typeof date !== "string" || !REGEX_EXP.ISO_DATE.test(date)) throw new AppError(ERROR_MESSAGES.DATE_REQUIRED, AppErrorCodes.VALIDATION_ERROR);

      const dailyAvailability = await this._fetchDailyAvailabilityUseCase.execute({ psychId: psychId!, date: date as string });

      res.status(StatusCodes.OK).json(dailyAvailability);
    } catch (error) {
      next(error);
    }
  }

  async listAvailabilityRules(req: Request, res: Response, next: NextFunction) {
    try {
      const psychId = req.account?.id;

      const summaries = await this._listAvailabilityRuleUseCase.execute({ psychId: psychId! });

      res.status(StatusCodes.OK).json({ summaries });
    } catch (error) {
      next(error);
    }
  }
}

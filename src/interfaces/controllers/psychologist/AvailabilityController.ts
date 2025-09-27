import { Request, Response, NextFunction } from "express";
import ICreateAvailabilityRuleUseCase from "../../../application/interfaces/ICreateAvailabilityRuleUseCase";
import IDeleteAvailabilityRuleUseCase from "../../../application/interfaces/IDeleteAvailabilityRuleUseCase";
import IFetchAvailabilityRuleUseCase from "../../../application/interfaces/IFetchAvailabilityRuleUseCase";
import IFetchDailyAvailabilityUseCase from "../../../application/interfaces/IFetchDailyAvailabilityUseCase";
import IListAvailabilityRuleUseCase from "../../../application/interfaces/IListAvailabilityRuleUseCase";
import IMarkHolidayUseCase from "../../../application/interfaces/IMarkHolidayUseCase";
import { StatusCodes } from "../../../utils/http-statuscodes";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import IDeleteHolidayUseCase from "../../../application/interfaces/IDeleteHolidayUseCase";
import { REGEX_EXP } from "../../constants/regex.constants";

export default class AvailabilityController {
  constructor(
    private readonly _createAvailabilityRuleUseCase: ICreateAvailabilityRuleUseCase,
    private readonly _deleteAvailabilityRuleUseCase: IDeleteAvailabilityRuleUseCase,
    private readonly _fetchAvailabilityRuleUseCase: IFetchAvailabilityRuleUseCase,
    private readonly _fetchDailyAvailabilityUseCase: IFetchDailyAvailabilityUseCase,
    private readonly _listAvailabilityRuleUseCase: IListAvailabilityRuleUseCase,
    private readonly _markHolidayUseCase: IMarkHolidayUseCase,
    private readonly _deleteHolidayUseCase:IDeleteHolidayUseCase
  ) {}

  async createAvailabilityRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req?.account?.id;
      if (
        !req.body.startTime ||
        typeof req.body.startTime !== "string" ||
        /^([01]\d|2[0-3]):[0-5]\d$/.test(req.body.startTime) === false
      ) {
        throw new AppError(
          ERROR_MESSAGES.START_TIME_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.endTime ||
        typeof req.body.endTime !== "string" ||
        /^([01]\d|2[0-3]):[0-5]\d$/.test(req.body.endTime) === false
      ) {
        throw new AppError(
          ERROR_MESSAGES.END_TIME_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.startDate ||
      typeof req.body.startDate !=="string" ||
      REGEX_EXP.ISO_DATE.test(req.body.startDate)===false ||
      isNaN(new Date(req.body.startDate).getTime())===true
      ) {
        throw new AppError(
          ERROR_MESSAGES.START_DATE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
       !req.body.endDate ||
      typeof req.body.endDate !=="string" ||
      REGEX_EXP.ISO_DATE.test(req.body.endDate)===false ||
      isNaN(new Date(req.body.endDate).getTime())===true
      ) {
        throw new AppError(
          ERROR_MESSAGES.START_DATE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.durationInMins ||
        typeof req.body.durationInMins !== "number"
      ) {
        throw new AppError(
          ERROR_MESSAGES.DURATION_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.bufferTimeInMins ||
        typeof req.body.bufferTimeInMins !== "number"
      ) {
        throw new AppError(
          ERROR_MESSAGES.BUFFER_TIME_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.quickSlots &&
        req.body.quickSlots.every((slot: any) => typeof slot === "string")
      ) {
        throw new AppError(
          ERROR_MESSAGES.QUICK_SLOT_FEES_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.specialDays &&
        req.body.specialDays.every(
          (day: any) =>
            typeof day.weekDay === "number" &&
            day.availableSlots.every((slot: any) => typeof slot === "string")
        )
      ) {
        throw new AppError(
          ERROR_MESSAGES.SPECIAL_DAYS_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if(
        !req.body.slotsOpenTime ||
      typeof req.body.slotsOpenTime !=="string" ||
      REGEX_EXP.ISO_DATE.test(req.body.slotsOpenTime)===false ||
      isNaN(new Date(req.body.slotsOpenTime).getTime())===true
      ){
        throw new AppError(
          ERROR_MESSAGES.SLOTS_OPEN_TIME_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        )
      }
      if (
        req.body.quickSlotsReleaseWindowMins &&
        typeof req.body.quickSlotsReleaseWindowMins !== "number"
      ) {
        throw new AppError(
          ERROR_MESSAGES.QUICK_SLOT_OPEN_TIME_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      const availabilityRule =
        await this._createAvailabilityRuleUseCase.execute({
          ...req.body,
          psychId: psychId!,
        });
      res
        .status(StatusCodes.OK)
        .json({ message: SUCCESS_MESSAGES.AVAILABILITY_RULE_CREATED });
    } catch (error) {
      next(error);
    }
  }

  async deleteAvailabilityRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req?.account?.id;
      const availabilityRuleId=req.params.availabilityRuleId
      if (
        typeof availabilityRuleId !== "string"
      ) {
        throw new AppError(
          ERROR_MESSAGES.AVAILABILITY_RULE_ID_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      await this._deleteAvailabilityRuleUseCase.execute({
        availabilityRuleId,
        psychId:psychId!,
      });

      res
        .status(StatusCodes.OK)
        .json({ message: SUCCESS_MESSAGES.AVAILABILITY_RULE_DELETED });
    } catch (error) {
      next(error);
    }
  }

  async fetchAvailabilityRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req?.account?.id;
      const availabilityRuleId=req.params.availabilityRuleId;
      if (
        typeof availabilityRuleId !== "string"
      ) {
        throw new AppError(
          ERROR_MESSAGES.AVAILABILITY_RULE_ID_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const availabilityRule = await this._fetchAvailabilityRuleUseCase.execute(
        {
          availabilityRuleId,
          psychId:psychId!,
        }
      );

      res.status(StatusCodes.OK).json({ availabilityRule });
    } catch (error) {
      next(error);
    }
  }
  async fetchDailyAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req?.account?.psychId;
      const date=req.query.date;
      if (
       !date ||
      typeof date !=="string" ||
      REGEX_EXP.ISO_DATE.test(date)===false ||
      isNaN(new Date(date).getTime())===true
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const result = await this._fetchDailyAvailabilityUseCase.execute({
        date,
        psychId,
      });

      res.status(StatusCodes.OK).json({ ...result });
    } catch (error) {
      next(error);
    }
  }

  async listAvailabilityRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req?.account?.id;

      const result = await this._listAvailabilityRuleUseCase.execute({
        psychId:psychId!
      });

      res.status(StatusCodes.OK).json({ summaries:[...result] });
    } catch (error) {
      next(error);
    }
  }

  async markHoliday(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req?.account?.psychId;
      if (
        !req.body.date ||
      typeof req.body.date !=="string" ||
      REGEX_EXP.ISO_DATE.test(req.body.date)===false ||
      isNaN(new Date(req.body.date).getTime())===true
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.availableSlots ||
        Array.isArray(req.body.availableSlots) === false ||
        req.body.availableSlots.every((slot: any) => typeof slot === "string")===false
      ) {
        throw new AppError(
          ERROR_MESSAGES.AVAILABLE_SLOTS_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      await this._markHolidayUseCase.execute(req.body);
      res
        .status(StatusCodes.OK)
        .json({ message: SUCCESS_MESSAGES.HOLIDAY_MARKED });
    } catch (error) {
      next(error);
    }
  }

  async deleteHoliday(
    req:Request,
    res:Response,
    next:NextFunction
  ){
    try{
    const psychId=req?.account?.psychId;
    const date=req.query.date;
    if(!date ||
      typeof date !=="string" ||
      REGEX_EXP.ISO_DATE.test(date)===false ||
      isNaN(new Date(date).getTime())===true
    ){
      throw new AppError(ERROR_MESSAGES.DATE_INVALID_FORMAT,
        AppErrorCodes.VALIDATION_ERROR
      )
    }
  
    await this._deleteHolidayUseCase.execute({date,psychId});
    res.status(StatusCodes.OK).json({message:SUCCESS_MESSAGES.HOLIDAY_UNMARKED})
  }catch(error){
    next(error)
  }    
  }
}

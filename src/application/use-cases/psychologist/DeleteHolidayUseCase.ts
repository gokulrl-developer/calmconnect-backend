import { DeleteHolidayDTO } from "../../../domain/dtos/psych.dto";
import IHolidayRepository from "../../../domain/interfaces/IHolidayRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IDeleteHolidayUseCase from "../../interfaces/IDeleteHolidayUseCase";

export default class DeleteHolidayUseCase implements IDeleteHolidayUseCase{
    constructor(
       private readonly _holidayRepository:IHolidayRepository
    ){}

    async execute(dto:DeleteHolidayDTO){
      const holidayEntity=await this._holidayRepository.findByDatePsych(new Date(dto.date),dto.psychId);
       if(!holidayEntity){
        throw new AppError(ERROR_MESSAGES.HOLIDAY_NOT_FOUND,AppErrorCodes.NOT_FOUND);
       }
       await this._holidayRepository.deleteById(holidayEntity.id!);
    }
}
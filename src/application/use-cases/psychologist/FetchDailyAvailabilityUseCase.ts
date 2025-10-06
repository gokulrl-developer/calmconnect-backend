import { time } from "console";
import { DailyAvailabilityDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IHolidayRepository from "../../../domain/interfaces/IHolidayRepository";
import { minutesToTimeString, timeStringToMinutes } from "../../../utils/timeConverter";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IFetchDailyAvailabilityUseCase from "../../interfaces/IFetchDailyAvailabilityUseCase";

export default class FetchDailyAvailabilityUseCase implements IFetchDailyAvailabilityUseCase{
    constructor(
     private readonly _availabilityRuleRepository:IAvailabilityRuleRepository,
     private readonly _holidayRepository:IHolidayRepository
    ){}

    async execute(dto:DailyAvailabilityDTO){
      console.log(dto)
      const holidayEntity=await this._holidayRepository.findByDatePsych(new Date(dto.date),dto.psychId);
        const availabilityRule= await this._availabilityRuleRepository.findByDatePsych(new Date(dto.date),dto.psychId);
        if(!availabilityRule){
            throw new AppError(ERROR_MESSAGES.AVAILABILITY_NOT_SET,AppErrorCodes.NOT_FOUND)
        }
        const weekDay=new Date(dto.date).getDay();
        console.log(weekDay)
        const startTime=timeStringToMinutes(availabilityRule.startTime);
        const endTime=timeStringToMinutes(availabilityRule.endTime);
        const {bufferTimeInMins,durationInMins}=availabilityRule;
        let availableSlots=[];               // available Slots for a non-special day in availability rule 
         let currTime=startTime;

        while(currTime<endTime){
            let currStartTime=currTime;
            currTime+=durationInMins;
          if(currTime<endTime){
            const slot={
                startTime:minutesToTimeString(currStartTime),
                quick:availabilityRule.quickSlots.includes(minutesToTimeString(currStartTime))?true:false,
                endTime:minutesToTimeString(currTime)
            }
             availableSlots.push(slot);
            currTime+=bufferTimeInMins;
          }
        }

        const isSpecialDay=availabilityRule.specialDays.some((day)=>day.weekDay===weekDay);
        if(isSpecialDay===true){
            const slotStartTimes=availabilityRule.specialDays.filter((day)=>day.weekDay===weekDay)[0].availableSlots;
            availableSlots=slotStartTimes.map((start:string)=>{

                return {
                  startTime:start,
                quick:availabilityRule.quickSlots.includes(start)?true:false,
                 endTime:minutesToTimeString(timeStringToMinutes(start)+durationInMins)
                }
            })
        }
        if(holidayEntity){            
            const slotStartTimes=holidayEntity.availableSlots;
             availableSlots=slotStartTimes.map((start:string)=>{

                return {
                  startTime:start,
                quick:availabilityRule.quickSlots.includes(start)?true:false,
                 endTime:minutesToTimeString(timeStringToMinutes(start)+durationInMins)
                }
            });
        }

        return {availableSlots}
    }
}
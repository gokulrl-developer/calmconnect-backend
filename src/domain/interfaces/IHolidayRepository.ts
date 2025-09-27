import IBaseRepository from "./IBaseRepository";
import Holiday from "../entities/holiday.entity"

export default interface IHolidayRepository extends IBaseRepository<Holiday>{
   updateDailySlots(holiday:Holiday):Promise<Holiday>,
   findByDate(date:Date):Promise<Holiday | null>,
}
import { FetchCheckoutDataDTO } from "../dtos/user.dto";

export interface CheckoutData{
  startTime:string,
  endTime:string,
  durationInMins:number, //mins
  quickSlot:boolean,
  fees:number //paise
}

export default interface IFetchCheckoutDataUseCase{
    execute(dto:FetchCheckoutDataDTO):Promise<CheckoutData>
}
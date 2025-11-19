import { FetchCheckoutDataDTO } from "../dtos/user.dto.js";

export interface CheckoutData{
  startTime:string,
  endTime:string,
  durationInMins:number, //mins
  fees:number //paise
}

export default interface IFetchCheckoutDataUseCase{
    execute(dto:FetchCheckoutDataDTO):Promise<CheckoutData>
}
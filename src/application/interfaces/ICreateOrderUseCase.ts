import { CreateOrderDTO } from "../dtos/user.dto.js";

export interface CreateOrderResponse {
  providerOrderId: string;  
  amount: number;           
  sessionId:string;        
       
}

export default interface ICreateOrderUseCase {
  execute(dto: CreateOrderDTO): Promise<CreateOrderResponse>;
}

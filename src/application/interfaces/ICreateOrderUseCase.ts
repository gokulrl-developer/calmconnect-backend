import { CreateOrderDTO } from "../../domain/dtos/user.dto";

export interface CreateOrderResponse {
  providerOrderId: string;  
  amount: number;           
  sessionId:string;        
       
}

export default interface ICreateOrderUseCase {
  execute(dto: CreateOrderDTO): Promise<CreateOrderResponse>;
}

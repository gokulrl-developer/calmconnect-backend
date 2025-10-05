export interface CreatePaymentOrder {
  amount: number;                  
  currency: string;                
}

export interface PaymentOrder {
  providerOrderId: string;  
}

export interface VerifyPayment {
  providerOrderId: string;   
  providerPaymentId: string; 
  signature: string;         
}

export interface PaymentVerification {
  success: boolean;
  providerPaymentId?: string;
  amount?: number;           
}

export default interface IPaymentProvider {
  createOrder(dto: CreatePaymentOrder): Promise<PaymentOrder>;
  verifyPayment(dto: VerifyPayment): Promise<PaymentVerification>;
}

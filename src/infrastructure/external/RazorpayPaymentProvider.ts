import Razorpay from "razorpay";
import crypto from "crypto";
import IPaymentProvider, { CreatePaymentOrder, PaymentOrder, PaymentVerification, VerifyPayment } from "../../domain/interfaces/IPaymentProvider.js";

export default class RazorpayPaymentProvider implements IPaymentProvider {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(dto: CreatePaymentOrder): Promise<PaymentOrder> {
    const order = await this.razorpay.orders.create({
      amount: Math.round(dto.amount), 
      currency: dto.currency,
      payment_capture: true, 
    });

    return {
      providerOrderId: order.id,
    };
  }

  async verifyPayment(dto: VerifyPayment): Promise<PaymentVerification> {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(dto.providerOrderId + "|" + dto.providerPaymentId)
      .digest("hex");

    if (generatedSignature === dto.signature) {
      const payment = await this.razorpay.payments.fetch(dto.providerPaymentId);
      return {
        success: true,
        providerPaymentId: dto.providerPaymentId,
        amount: Number(payment.amount),
      };
    } else {
      return {
        success: false,
      };
    }
  }
}

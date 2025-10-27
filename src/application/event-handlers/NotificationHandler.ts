import { IEventBus } from "../interfaces/events/IEventBus";
import INotificationHandler from "../interfaces/events/INotificationHandler";
import ISendNotificationUseCase from "../interfaces/ISendNotificationUseCase";


export default class NotificationHandler implements INotificationHandler{
  constructor(private readonly _sendNotificationUseCase: ISendNotificationUseCase) {}

  subscribe(eventBus: IEventBus): void {
    eventBus.subscribe("application.created", async ({ applicationId, psychologistEmail }) => {
        const adminId = process.env.ADMIN_ID;
       
        await this._sendNotificationUseCase.execute({
          recipientType:"admin",
          recipientId: adminId!,
          title: "New Psychologist Application",
          message: `New Psychologist application from email :${psychologistEmail} .`,
          type: "application",
        });
    });

    eventBus.subscribe("session.created", async ({ userFullName, userEmail, psychologistId }) => {
        await this._sendNotificationUseCase.execute({
          recipientType:"psychologist",
          recipientId: psychologistId,
          title: "New Booking",
          message: `${userFullName} ( email:${userEmail}) booked a session with you.`,
          type: "booking",
        });
    }); 
  
  }

}

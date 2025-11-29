import { EventMapEvents } from "../../domain/enums/EventMapEvents.js";
import { NotificationRecipientType } from "../../domain/enums/NotificationRecipientType.js";
import { adminConfig } from "../../utils/adminConfig.js";
import { IEventBus } from "../interfaces/events/IEventBus.js";
import INotificationHandler from "../interfaces/events/INotificationHandler.js";
import ISendNotificationUseCase from "../interfaces/ISendNotificationUseCase.js";


export default class NotificationHandler implements INotificationHandler{
  constructor(private readonly _sendNotificationUseCase: ISendNotificationUseCase) {}

  subscribe(eventBus: IEventBus): void {
    eventBus.subscribe(EventMapEvents.APPLICATION_CREATED, async ({ psychologistName,adminId, psychologistEmail }) => {
       
        await this._sendNotificationUseCase.execute({
          recipientType:NotificationRecipientType.ADMIN,
          recipientId: adminId!,
          title: "New Psychologist Application",
          message: `New Psychologist application from ${psychologistName} of email :${psychologistEmail} .`,
          type: "application",
        });
    });

    eventBus.subscribe(EventMapEvents.SESSION_CREATED, async ({ userFullName, userEmail, psychologistId }) => {
        await this._sendNotificationUseCase.execute({
          recipientType:NotificationRecipientType.PSYCHOLOGIST,
          recipientId: psychologistId,
          title: "New Booking",
          message: `${userFullName} ( email:${userEmail}) booked a session with you.`,
          type: "booking",
        });
    }); 
    eventBus.subscribe(EventMapEvents.COMPLAINT_RAISED, async ({ complaintId,userFullName,psychologistFullName,sessionId }) => {
        await this._sendNotificationUseCase.execute({
          recipientType:NotificationRecipientType.ADMIN,
          recipientId: adminConfig.adminId,
          title: "Complaint Raised",
          message: `${userFullName} raised a complaint : #${complaintId.split("").slice(-4).join("")} against ${psychologistFullName} related to the session : #${sessionId.split("").slice(-4).join("")}`,
          type: "complaint",
        });
    }); 
    eventBus.subscribe(EventMapEvents.COMPLAINT_RESOLVED, async ({ complaintId,userId,psychologistFullName}) => {
        await this._sendNotificationUseCase.execute({
          recipientType:NotificationRecipientType.USER,
          recipientId: userId,
          title: "Complaint Resolved",
          message: `Your complaint : #${complaintId.split("").slice(-4).join("")} against ${psychologistFullName} has been resolved`,
          type: "complaint",
        });
    }); 
  
  }

}

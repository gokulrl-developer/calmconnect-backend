import { EventMapEvents } from "../../domain/enums/EventMapEvents.js";
import { NotificationRecipientType } from "../../domain/enums/NotificationRecipientType.js";
import IAdminRepository from "../../domain/interfaces/IAdminRepository.js";
import IPsychRepository from "../../domain/interfaces/IPsychRepository.js";
import ISessionRepository from "../../domain/interfaces/ISessionRepository.js";
import IUserRepository from "../../domain/interfaces/IUserRepository.js";
import { ERROR_MESSAGES } from "../constants/error-messages.constants.js";
import { AppErrorCodes } from "../error/app-error-codes.js";
import AppError from "../error/AppError.js";
import { IEventBus } from "../interfaces/events/IEventBus.js";
import INotificationHandler from "../interfaces/events/INotificationHandler.js";
import ISendNotificationUseCase from "../interfaces/ISendNotificationUseCase.js";

export default class NotificationHandler implements INotificationHandler {
  constructor(
    private readonly _sendNotificationUseCase: ISendNotificationUseCase,
    private readonly _adminRepository: IAdminRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _psychRepository: IPsychRepository,
    private readonly _sessionRepository: ISessionRepository
  ) {}

  subscribe(eventBus: IEventBus): void {
    eventBus.subscribe(
      EventMapEvents.APPLICATION_CREATED,
      async ({ psychologistName, adminId, psychologistEmail }) => {
        await this._sendNotificationUseCase.execute({
          recipientType: NotificationRecipientType.ADMIN,
          recipientId: adminId!,
          title: "New Psychologist Application",
          message: `New Psychologist application from ${psychologistName} of email :${psychologistEmail} .`,
          type: "application",
        });
      }
    );

    eventBus.subscribe(
      EventMapEvents.SESSION_CREATED,
      async ({ userFullName, userEmail, psychologistId }) => {
        await this._sendNotificationUseCase.execute({
          recipientType: NotificationRecipientType.PSYCHOLOGIST,
          recipientId: psychologistId,
          title: "New Booking",
          message: `${userFullName} ( email:${userEmail}) booked a session with you.`,
          type: "booking",
        });
      }
    );
    eventBus.subscribe(
      EventMapEvents.USER_CANCELLED_SESSION,
      async ({ userFullName, psychologistId, date, time }) => {
        await this._sendNotificationUseCase.execute({
          recipientType: NotificationRecipientType.PSYCHOLOGIST,
          recipientId: psychologistId,
          title: "Session Cancellation",
          message: `${userFullName}  cancelled the session scheduled on ${date} at ${time}.`,
          type: "booking",
        });
      }
    );
    eventBus.subscribe(
      EventMapEvents.PSYCHOLOGIST_CANCELLED_SESSION,
      async ({ psychologistFullName, userId, date, time }) => {
        await this._sendNotificationUseCase.execute({
          recipientType: NotificationRecipientType.USER,
          recipientId: userId,
          title: "Session Cancellation",
          message: `${psychologistFullName}  cancelled the session scheduled on ${date} at ${time}.`,
          type: "booking",
        });
      }
    );
    eventBus.subscribe(
      EventMapEvents.COMPLAINT_RAISED,
      async ({
        complaintId,
        userFullName,
        psychologistFullName,
        sessionId,
      }) => {
        const adminData = await this._adminRepository.findOne();
        if (!adminData) {
          throw new AppError(
            ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            AppErrorCodes.INTERNAL_ERROR
          );
        }
        await this._sendNotificationUseCase.execute({
          recipientType: NotificationRecipientType.ADMIN,
          recipientId: adminData.adminId,
          title: "Complaint Raised",
          message: `${userFullName} raised a complaint : #${complaintId.split("").slice(-4).join("")} against ${psychologistFullName} related to the session : #${sessionId.split("").slice(-4).join("")}`,
          type: "complaint",
        });
      }
    );
    eventBus.subscribe(
      EventMapEvents.COMPLAINT_RESOLVED,
      async ({ complaintId, userId, psychologistFullName }) => {
        await this._sendNotificationUseCase.execute({
          recipientType: NotificationRecipientType.USER,
          recipientId: userId,
          title: "Complaint Resolved",
          message: `Your complaint : #${complaintId.split("").slice(-4).join("")} against ${psychologistFullName} has been resolved`,
          type: "complaint",
        });
      }
    );
    eventBus.subscribe(EventMapEvents.USER_JOINED, async ({ sessionId }) => {
      const session = await this._sessionRepository.findById(sessionId);
      if (!session) {
        throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
      const user = await this._userRepository.findById(session.user);
      const psychologist = await this._psychRepository.findById(
        session.psychologist
      );
      if (!user) {
        throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
      if (!psychologist) {
        throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
      await this._sendNotificationUseCase.execute({
        recipientType: NotificationRecipientType.PSYCHOLOGIST,
        recipientId: session.psychologist,
        title: "User Joined",
        message: ` ${user.firstName} ${user.lastName} has joined for session.To join immediately click the link below`,
        type: "Booking",
        link:`/psychologist/sessions/${sessionId}/video`
      });
    });
    eventBus.subscribe(EventMapEvents.PSYCHOLOGIST_JOINED, async ({ sessionId }) => {
      const session = await this._sessionRepository.findById(sessionId);
      if (!session) {
        throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
      const user = await this._userRepository.findById(session.user);
      const psychologist = await this._psychRepository.findById(
        session.psychologist
      );
      if (!user) {
        throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
      if (!psychologist) {
        throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
      await this._sendNotificationUseCase.execute({
        recipientType: NotificationRecipientType.USER,
        recipientId: session.user,
        title: "Psychologist Joined",
        message: `Dr ${psychologist.firstName} ${psychologist.lastName} has joined for session.To join immediately click the link below`,
        type: "Booking",
        link:`/user/sessions/${sessionId}/video`
      });
    });
  }
}

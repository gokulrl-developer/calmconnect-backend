import { UpdateApplicationStatusDTO } from "../../dtos/admin.dto.js";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { sendMail } from "../../../utils/nodemailHelper.js";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IUpdateApplicationUseCase from "../../interfaces/IUpdateApplicationUseCase.js";
import { toPsychologistFromApplication } from "../../mappers/PsychMapper.js";
import { ApplicationStatus } from "../../../domain/enums/ApplicationStatus.js";

export default class UpdateApplicationUseCase implements IUpdateApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _psychologistRepository:IPsychRepository
) {}

  async execute(dto: UpdateApplicationStatusDTO): Promise<void> {
    const application = await this._applicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new AppError(ERROR_MESSAGES.APPLICATION_NOT_FOUND,AppErrorCodes.NOT_FOUND);
    }
    const psych=await this._psychologistRepository.findById(application.psychologist);
     application.status=dto.status;
     application.rejectionReason=dto.reason?dto.reason:undefined;
     if(application.status===ApplicationStatus.ACCEPTED){
      application.isVerified=true;
      psych!.isVerified=true;
     }
    await this._applicationRepository.update(
      dto.applicationId,
      application
    );
    await this._psychologistRepository.update(application.psychologist,toPsychologistFromApplication(application,psych!) )
    if(dto.status===ApplicationStatus.REJECTED){
      const name=application.firstName+" "+application.lastName;
        sendMail(application.email,
           EMAIL_MESSAGES.REJECTON_MAIL_SUBJECT,
          EMAIL_MESSAGES.REJECTION_MAIL_BODY(name,application.rejectionReason! )
        )
    }
  }
}

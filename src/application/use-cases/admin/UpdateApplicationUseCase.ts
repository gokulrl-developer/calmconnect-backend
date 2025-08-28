import { UpdateApplicationStatusDTO } from "../../../domain/dtos/admin.dto";
import Psychologist from "../../../domain/entities/psychologist.entity";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { sendMail } from "../../../utils/nodemailHelper";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IUpdateApplicationUseCase from "../../interfaces/IUpdateApplicationUseCase";


export default class UpdateApplicationUseCase implements IUpdateApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _psychologistRepository:IPsychRepository
) {}

  async execute(dto: UpdateApplicationStatusDTO): Promise<void> {
    const application = await this._applicationRepository.findById(dto.applicationId);
    if (!application) throw new AppError(ERROR_MESSAGES.APPLICATION_NOT_FOUND,AppErrorCodes.NOT_FOUND);
     application.status=dto.status;
     application.rejectionReason=dto.reason?dto.reason:undefined;
    await this._applicationRepository.update(
      dto.applicationId,
      application
    );
    const psych=await this._psychologistRepository.findById(application.psychologist);
    if(dto.status==="accepted"){
    psych!.isVerified=true;
    }
    await this._psychologistRepository.update(application.psychologist,psych as Psychologist)
    if(dto.status==="rejected"){
      const name=application.firstName+" "+application.lastName;
        sendMail(application.email,
           EMAIL_MESSAGES.REJECTON_MAIL_SUBJECT,
          EMAIL_MESSAGES.REJECTION_MAIL_BODY(name,application.rejectionReason! )
        )
    }
  }
}

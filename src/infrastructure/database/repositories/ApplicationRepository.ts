import { Types } from "mongoose";
import { Application } from "../../../domain/entities/application.entity.js";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository.js";
import { IApplicationDocument, ApplicationModel } from "../models/ApplicationModel.js";
import { BaseRepository } from "./BaseRepository.js";

export default class ApplicationRepository
  extends BaseRepository<Application, IApplicationDocument>
  implements IApplicationRepository
{
  constructor() {
    super(ApplicationModel);
  }

  protected toDomain(doc: IApplicationDocument): Application {
    const application = doc.toObject();
    return new Application(
    application.psychologist.toString(),
    application.firstName,
    application.lastName,
    application.email,
    application.isVerified,
    application.submittedAt, 
    application.phone, 
    application.gender,
    application.dob,
    application.profilePicture,
    application.address,
    application.walletBalance,
    application.languages,
    application.specializations,
    application.bio,
    application.licenseUrl,
    application.resume,
    application.qualifications,
    application.status, 
    application.rejectionReason??undefined,   
    application.password,
    application.hourlyFees??undefined,
    application._id.toString(),
    application.avgRating??undefined,
    application.createdAt??undefined   
        );
  }

  protected toPersistence(entity: Partial<Application>): Partial<IApplicationDocument> {
  return {
    psychologist: entity.psychologist 
      ? new Types.ObjectId(entity.psychologist) 
      : undefined,
    firstName: entity.firstName,
    lastName: entity.lastName,
    email: entity.email,
    isVerified: entity.isVerified,
    submittedAt: entity.submittedAt,
    phone: entity.phone,
    gender: entity.gender,
    dob: entity.dob,
    profilePicture: entity.profilePicture,
    address: entity.address,
    walletBalance: entity.walletBalance,
    languages: entity.languages,
    specializations: entity.specializations,
    bio: entity.bio,
    licenseUrl: entity.licenseUrl,
    resume:entity.resume,
    qualifications: entity.qualifications,
    password: entity.password,
    hourlyFees: entity.hourlyFees,
    status: entity.status,
    rejectionReason: entity.rejectionReason,
    avgRating: entity.avgRating,
    createdAt: entity.createdAt,
  };
}


  async findLatestByPsychId(psychId: string): Promise<Application | null> {
    const app = await this.model.findOne({ psychologist: psychId }).sort({ submittedAt: -1 });
    return app ? this.toDomain(app) : null;
  }

  async findAllByPsychId(psychId: string): Promise<Application[]> {
    const apps = await this.model.find({ psychologist: psychId }).sort({ submittedAt: -1 });
    return apps.map((a) => this.toDomain(a));
  }

  async listApplications(skip: number, limit: number,search:string,status?:"pending"|"accepted"|"rejected"): Promise<Application[]> {
    const query: ListApplicationsQuery={};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if(status){
      query.status=status
    }
    const apps = await this.model
      .find(query) 
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    return apps.map((a) => this.toDomain(a));
  }
/**
 * 
 * @param id 
 * @returns 
 */
  async findApplicationById(id: string): Promise<Application | null> {
    const app=await this.model
    .findOne({_id:id})
    return app?this.toDomain(app):null;
  }
}

interface ListApplicationsQuery{
 $or?: {
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }[];
  status?: "pending" | "accepted" | "rejected";
}
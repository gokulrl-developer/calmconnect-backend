import { ListPsychDTO } from "../../../domain/dtos/admin.dto";
import Psychologist from "../../../domain/entities/psychologist.entity";
import IPsychologistRepository from "../../../domain/interfaces/IPsychRepository";
import { IPsychDocument, PsychModel } from "../models/PsychologistModel";
import { BaseRepository } from "./BaseRepository";

export default class PsychRepository 
  extends BaseRepository<Psychologist, IPsychDocument> 
  implements IPsychologistRepository 
{
  constructor() {
    super(PsychModel);
  }

  protected toDomain(doc: IPsychDocument): Psychologist {
    const psych=doc.toObject();
    return new Psychologist(
        psych.firstName,
        psych.lastName,
        psych.email,
        psych.isVerified,
        psych.isBlocked,
        psych.walletBalance,
        psych._id.toString(),
        psych.password,
        psych.gender ??undefined,
        psych.dob ??undefined,
        psych.profilePicture ??undefined,
        psych.address ??undefined,
        psych.languages,
        psych.specializations,
        psych.bio ??undefined,
        psych.avgRating ??undefined,
        psych.hourlyFees ??undefined,
        psych.applications,
        psych.licenseUrl ??undefined,
        psych.qualifications,
        psych.createdAt ??undefined,
        psych.isGooglePsych,
        psych.googleId ??undefined
        
      )
  }

  protected toPersistence(entity: Partial<Psychologist>): Partial<IPsychDocument> {
  return {
    firstName: entity.firstName,
    lastName: entity.lastName,
    email: entity.email,
    password: entity.password,
    isBlocked: entity.isBlocked,
    isVerified: entity.isVerified,
    walletBalance: entity.walletBalance,
    gender: entity.gender,
    dob: entity.dob,
    profilePicture: entity.profilePicture,
    address: entity.address,
    languages: entity.languages,
    specializations: entity.specializations,
    bio: entity.bio,
    avgRating: entity.avgRating,
    hourlyFees: entity.hourlyFees,
    applications: entity.applications,
    licenseUrl: entity.licenseUrl,
    qualifications: entity.qualifications,
    createdAt: entity.createdAt,
    isGooglePsych: entity.isGooglePsych,
    googleId: entity.googleId,
  };
}


  async findByEmail(email: string): Promise<Psychologist | null> {
    const psych = await this.model.findOne({ email });
    return psych ? this.toDomain(psych) : null;
  }

  async findList(dto: ListPsychDTO): Promise<Psychologist[]> {
    const { page, search, filter } = dto;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query: any = {isVerified:true};
   
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (filter) {
      query.isBlocked = filter === "inactive";
    }

    const psychs = await this.model.find(query).skip(skip).limit(limit);
    return psychs.map((p) => this.toDomain(p));
  }
}

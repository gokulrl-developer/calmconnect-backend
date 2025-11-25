import { FilterQuery, PipelineStage } from "mongoose";
import { ListPsychDTO } from "../../../application/dtos/admin.dto.js";
import Psychologist from "../../../domain/entities/psychologist.entity.js";
import IPsychologistRepository, { ListPsychQueryByUser, PsychSummary, PsychTrendsEntry } from "../../../domain/interfaces/IPsychRepository.js";
import { IPsychDocument, PsychModel } from "../models/PsychologistModel.js";
import { BaseRepository } from "./BaseRepository.js";

export default class PsychRepository
  extends BaseRepository<Psychologist, IPsychDocument>
  implements IPsychologistRepository
{
  constructor() {
    super(PsychModel);
  }

  protected toDomain(doc: IPsychDocument): Psychologist {
    const psych = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return new Psychologist(
      psych.firstName,
      psych.lastName,
      psych.email,
      psych.isVerified,
      psych.isBlocked,
      psych.walletBalance,
      psych._id.toString(),
      psych.password,
      psych.gender ?? undefined,
      psych.dob ?? undefined,
      psych.profilePicture ?? undefined,
      psych.address ?? undefined,
      psych.languages,
      psych.specializations,
      psych.bio ?? undefined,
      psych.avgRating ?? undefined,
      psych.hourlyFees ?? undefined,
      psych.applications,
      psych.licenseUrl ?? undefined,
      psych.qualifications,
      psych.createdAt ?? undefined,
      psych.isGooglePsych,
      psych.googleId ?? undefined
    );
  }

  protected toPersistence(
    entity: Partial<Psychologist>
  ): Partial<IPsychDocument> {
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

    const query:AdminPsychListQuery= { isVerified: true };

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

 async listPsychByUser(
  query: ListPsychQueryByUser
): Promise<{ psychologists: Psychologist[]; totalItems: number }> {
  const {
    specialization,
    gender,
    sort,
    search,
    skip = 0,
    limit = 10,
  } = query;

  const match:PsychListQueryByUser = { isVerified: true };

  if (gender) match.gender = gender;
  if (specialization) match.specializations = specialization;

  if (search) {
    const regex = new RegExp(search, "i");
    match.$or = [
      { firstName: regex },
      { lastName: regex },
      { specializations: regex },
      { languages: regex },
    ];
  }

  const basePipeline: PipelineStage[] = [{ $match: match }];

  if (sort) {
    const sortMap: Record<string,  Record<string, 1 | -1>> = {
      "a-z": { firstName: 1 },
      "z-a": { firstName: -1 },
      rating: { avgRating: -1 },
      price: { hourlyFees: 1 }, 
    };

    basePipeline.push({ $sort: sortMap[sort] });
  }

  basePipeline.push({ $skip: skip }, { $limit: limit });

  const countPipeline = [{ $match: match }, { $count: "count" }];

  const [data, countResult] = await Promise.all([
    this.model.aggregate(basePipeline).exec(),
    this.model.aggregate(countPipeline).exec(),
  ]);

  const psychologists = data.map((doc: IPsychDocument) =>
    this.toDomain(doc)
  );
  const totalItems = countResult[0]?.count || 0;

  return { psychologists, totalItems };
}

 async fetchPsychTrends(
    fromDate: Date,
    toDate: Date,
    interval: "day" | "month" | "year"
  ): Promise<PsychTrendsEntry[]> {
    const dateFormat =
      interval === "day"
        ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        : interval === "month"
        ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
        : { $dateToString: { format: "%Y", date: "$createdAt" } };

    const results = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: dateFormat,
          psychologists: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      label: r._id,
      psychologists: r.psychologists,
    }));
  }

  
async fetchPsychSummary(fromDate: Date, toDate: Date): Promise<PsychSummary> {
  const totalValuePromise = this.model.countDocuments({ isVerified: true }).exec();

  const addedValuePromise = this.model.countDocuments({
    createdAt: { $gte: fromDate, $lte: toDate },
  }).exec();

  const [totalValue, addedValue] = await Promise.all([totalValuePromise, addedValuePromise]);

  return { totalValue, addedValue };
}
}

interface AdminPsychListQuery extends FilterQuery<Psychologist> {
  isVerified: boolean;
  isBlocked?: boolean;
  $or?: Array<{
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

interface PsychListQueryByUser extends FilterQuery<Psychologist> {
  isVerified: boolean;
  gender?: string;
  specializations?: string;
  $or?: Array<{
    firstName?: RegExp;
    lastName?: RegExp;
    specializations?: RegExp;
    languages?: RegExp;
  }>;
  skip?: number;
  limit?: number;
  sort?: "a-z" | "z-a" | "rating" | "price";
}

import { ListPsychDTO } from "../../../domain/dtos/admin.dto";
import Psychologist from "../../../domain/entities/psychologist.entity";
import IPsychologistRepository from "../../../domain/interfaces/IPsychRepository";
import { ListPsychQueryByUser } from "../../../domain/interfaces/repository-types/psychologistTypes";
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
      psych.quickSlotHourlyFees ?? undefined,
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
      quickSlotHourlyFees: entity.quickSlotHourlyFees,
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

    const query: any = { isVerified: true };

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
      language,
      date,
      sort,
      search,
      skip = 0,
      limit = 10,
    } = query;

    const match: any = { isVerified: true };
    if (gender) match.gender = gender;
    if (specialization) match.specializations = specialization;
    if (language) match.languages = language;

    if (search) {
      const regex = new RegExp(search, "i");
      match.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { specializations: regex },
        { languages: regex },
      ];
    }

    const basePipeline: any[] = [{ $match: match }];

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      basePipeline.push(
        {
          $lookup: {
            from: "sessions",
            let: { psychId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$psychologist", "$$psychId"] },
                      { $gte: ["$startTime", startOfDay] },
                      { $lte: ["$startTime", endOfDay] },
                      { $eq: ["$status", "scheduled"] },
                    ],
                  },
                },
              },
            ],
            as: "sessions",
          },
        },
        {
          $lookup: {
            from: "availabilityrules",
            let: { psychId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$psychologist", "$$psychId"] },
                      { $lte: ["$startDate", targetDate] },
                      { $gte: ["$endDate", targetDate] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ],
            as: "availabilityRule",
          },
        },
        {
          $lookup: {
            from: "holidays",
            let: { psychId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$psychologist", "$$psychId"] },
                      { $gte: ["$date", startOfDay] },
                      { $lte: ["$date", endOfDay] },
                    ],
                  },
                },
              },
            ],
            as: "holidays",
          },
        },
        {
          $addFields: {
            numberOfAvailableSlots: {
              $cond: [
                { $gt: [{ $size: "$holidays" }, 0] },
                0,
                {
                  $let: {
                    vars: { rule: { $arrayElemAt: ["$availabilityRule", 0] } },
                    in: {
                      $floor: {
                        $divide: [
                          { $subtract: ["$$rule.endTime", "$$rule.startTime"] },
                          {
                            $add: [
                              "$$rule.durationInMins",
                              "$$rule.bufferTimeInMins",
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            numberOfAvailableSlots: {
              $max: [
                0,
                {
                  $subtract: [
                    "$numberOfAvailableSlots",
                    { $size: "$sessions" },
                  ],
                },
              ],
            },
          },
        },
        { $match: { numberOfAvailableSlots: { $gt: 0 } } }
      );
    }

    if (sort) {
      const sortMap: Record<string, any> = {
        "a-z": { firstName: 1 },
        "z-a": { firstName: -1 },
        rating: { avgRating: -1 },
        price: { hourlyFees: 1 },
      };
      basePipeline.push({ $sort: sortMap[sort] });
    }

    // Use $facet to get both paginated data and total count
    const pipeline = [
      {
        $facet: {
          data: [...basePipeline, { $skip: skip }, { $limit: limit }],
          totalCount: [...basePipeline, { $count: "count" }],
        },
      },
      {
        $unwind: { path: "$totalCount", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: { totalCount: { $ifNull: ["$totalCount.count", 0] } },
      },
    ];

    const result = await this.model.aggregate(pipeline).exec();

    const psychologists = (result[0]?.data || []).map((doc: IPsychDocument) =>
      this.toDomain(doc)
    );
    const totalItems = result[0]?.totalCount || 0;
    return { psychologists, totalItems };
  }
}

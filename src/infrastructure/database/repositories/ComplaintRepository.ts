import { Types, PipelineStage, Document } from "mongoose";
import Complaint from "../../../domain/entities/complaint.entity";
import IComplaintRepository, { ComplaintHistoryFilter, UserRecentComplaintsEntryFromPersistence } from "../../../domain/interfaces/IComplaintRepository";
import { ComplaintModel, IComplaintDocument } from "../models/ComplaintModel";
import { BaseRepository } from "./BaseRepository";

interface ComplaintSearchFilter {
  status?: "resolved" | "pending";
  search?: string;
  skip: number;
  limit: number;
}

interface PaginatedComplaintResult {
  complaints: Complaint[];
  totalItems: number;
}

interface FilterQueryUserList{
    user:Types.ObjectId;
}

interface FilterQueryAdminList{
  status?:"resolved"|"pending",
  search?:string
}
export default class ComplaintRepository
  extends BaseRepository<Complaint, IComplaintDocument>
  implements IComplaintRepository
{
  constructor() {
    super(ComplaintModel);
  }

  protected toDomain(doc: IComplaintDocument): Complaint {
    const c = doc instanceof Document?doc.toObject():doc;
    return new Complaint(
      c.user.toString(),
      c.psychologist.toString(),
      c.session?.toString() ?? "",
      c.description,
      c.status,
      c.createdAt,
      c.adminNotes ?? "",
      c._id.toString(),
      c.resolvedAt
    );
  }

  protected toPersistence(entity: Partial<Complaint>): Partial<IComplaintDocument> {
    const persistence: Partial<IComplaintDocument> = {};
    if (entity.user) persistence.user = new Types.ObjectId(entity.user);
    if (entity.psychologist) persistence.psychologist = new Types.ObjectId(entity.psychologist);
    if (entity.session) persistence.session = new Types.ObjectId(entity.session);
    if (entity.description !== undefined) persistence.description = entity.description;
    if (entity.status !== undefined) persistence.status = entity.status;
    if (entity.adminNotes !== undefined) persistence.adminNotes = entity.adminNotes;
    if (entity.resolvedAt !== undefined) persistence.resolvedAt = entity.resolvedAt;
    if (entity.id) persistence._id = new Types.ObjectId(entity.id);
    return persistence;
  }

  async findComplaintsByUser(
    userId: string,
    skip: number,
    limit: number
  ): Promise<PaginatedComplaintResult> {
    const userObjectId = new Types.ObjectId(userId);
    const filter: FilterQueryUserList = { user: userObjectId };
    const [docs, totalItems] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    const complaints = docs.map((doc) => this.toDomain(doc));
    return { complaints, totalItems };
  }

  async findComplaintsWithSearchFilter(
    filter: ComplaintSearchFilter
  ): Promise<PaginatedComplaintResult> {
    const { status, search, skip, limit } = filter;
    const matchStage: FilterQueryAdminList = {};
    if (status) matchStage.status = status;

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "psychologists",
          localField: "psychologist",
          foreignField: "_id",
          as: "psychologist",
        },
      },
      { $unwind: "$psychologist" },
      { $match: matchStage },
    ];

    if (search) {
      const regex = new RegExp(search, "i");
      const searchCondition: PipelineStage.Match["$match"] = {
        $or: [
          { "user.firstName": regex },
          { "user.lastName": regex },
          { "user.email": regex },
          { "psychologist.firstName": regex },
          { "psychologist.lastName": regex },
          { "psychologist.email": regex },
        ],
      };
      pipeline.push({ $match: searchCondition });
    }
    
    pipeline.push({ $set: {user:"$user._id",psychologist:"$psychologist._id"} });
    pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });

    const [results, totalItems] = await Promise.all([
      this.model.aggregate(pipeline),
      this.model.countDocuments(status ? { status } : {}),
    ]);

    const complaints = results.map((r) => this.toDomain(r));
    return { complaints, totalItems };
  }
  async findComplaintsByPsychologist(
    filter: ComplaintHistoryFilter
  ): Promise<PaginatedComplaintResult> {
    const { psychId, skip, limit } = filter;

    const [results, totalItems] = await Promise.all([
      this.model.find({psychologist:new Types.ObjectId(psychId)}).sort({createdAt:-1}).skip(skip).limit(limit),
      this.model.countDocuments(status ? { status } : {}),
    ]);

    const complaints = results.map((r) => this.toDomain(r));
    return { complaints, totalItems };
  }

  async fetchRecentUserComplaints(
    userId: string,
    limit: number
  ): Promise<UserRecentComplaintsEntryFromPersistence[]> {
    const userObjectId = new Types.ObjectId(userId);

    const pipeline: PipelineStage[] = [
      { $match: { user: userObjectId } },
      {
        $lookup: {
          from: "psychologists",
          localField: "psychologist",
          foreignField: "_id",
          as: "psychologist",
        },
      },
      { $unwind: "$psychologist" },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $project: {
          complaintId: "$_id",
          psychFirstName: "$psychologist.firstName",
          psychLastName: "$psychologist.lastName",
          raisedTime: "$createdAt",
          status: 1,
        },
      },
    ];

    const results = await this.model.aggregate(pipeline);

    return results.map((r) => ({
      complaintId: r.complaintId.toString(),
      psychFirstName: r.psychFirstName,
      psychLastName: r.psychLastName,
      raisedTime: r.raisedTime,
      status: r.status,
    }));
  }
}

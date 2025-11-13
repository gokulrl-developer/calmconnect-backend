import { Types, Document } from "mongoose";
import Review from "../../../domain/entities/review.entity";
import IReviewRepository, { ListPsychReviewsFilter, RatingSummaryFromPersistence } from "../../../domain/interfaces/IReviewRepository";
import { ReviewModel, IReviewDocument } from "../models/ReviewModel";
import { BaseRepository } from "./BaseRepository";
import { SortOrder } from "mongoose";

export default class ReviewRepository
  extends BaseRepository<Review, IReviewDocument>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }

  protected toDomain(doc: IReviewDocument): Review {
    const r = doc instanceof Document ? doc.toObject() : doc;
    return new Review(
      r.sessionId.toString(),
      r.user.toString(),
      r.psychologist.toString(),
      r.rating,
      r.createdAt,
      r._id.toString(),
      r.comment
    );
  }

  protected toPersistence(entity: Partial<Review>): Partial<IReviewDocument> {
    const persistence: Partial<IReviewDocument> = {};
    if (entity.sessionId) persistence.sessionId = new Types.ObjectId(entity.sessionId);
    if (entity.user) persistence.user = new Types.ObjectId(entity.user);
    if (entity.psychologist) persistence.psychologist = new Types.ObjectId(entity.psychologist);
    if (entity.rating !== undefined) persistence.rating = entity.rating;
    if (entity.comment !== undefined) persistence.comment = entity.comment;
    if (entity.id) persistence._id = new Types.ObjectId(entity.id);
    return persistence;
  }

  async listPsychReviews(
    filter: ListPsychReviewsFilter
  ): Promise<{ reviews: Review[]; totalItems: number }> {
    const { psychId, sort, skip, limit } = filter;

    const sortOption :Record<string, SortOrder> =
      sort === "top-rated" ? { rating: -1, createdAt: -1 } : { createdAt: -1 };

    const [docs, totalItems] = await Promise.all([
      this.model
        .find({ psychologist: new Types.ObjectId(psychId) })
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      this.model.countDocuments({ psychologist: new Types.ObjectId(psychId) }),
    ]);

    const reviews = docs.map((d) => this.toDomain(d));
    return { reviews, totalItems };
  }

   async fetchRatingSummaryByPsych(
    psychId: string
  ): Promise<RatingSummaryFromPersistence> {
    const psychologistId = new Types.ObjectId(psychId);

    const currentAgg = await this.model.aggregate([
      { $match: { psychologist: psychologistId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const current =
      currentAgg.length > 0 ? currentAgg[0].avgRating : 0;

    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const lastMonthAgg = await this.model.aggregate([
      {
        $match: {
          psychologist: psychologistId,
          createdAt: { $gte: lastMonthStart },
        },
      },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const lastMonth =
      lastMonthAgg.length > 0 ? lastMonthAgg[0].avgRating : 0;

    return { current, lastMonth };
  }
}

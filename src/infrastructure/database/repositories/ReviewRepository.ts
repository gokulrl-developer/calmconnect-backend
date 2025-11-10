import { Types, Document } from "mongoose";
import Review from "../../../domain/entities/review.entity";
import IReviewRepository, { ListPsychReviewsFilter } from "../../../domain/interfaces/IReviewRepository";
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
}

import { FilterQuery } from "mongoose";
import { ListUsersDTO } from "../../../application/dtos/admin.dto.js";
import User from "../../../domain/entities/user.entity.js";
import IUserRepository, { UserTrendsEntry, UserTrendsSummary } from "../../../domain/interfaces/IUserRepository.js";
import { IUserDocument, UserModel } from "../models/UserModel.js";
import { BaseRepository } from "./BaseRepository.js";
import { UserStatus } from "../../../domain/enums/UserStatus.js";
import { UserTrendsIntervalByAdmin } from "../../../domain/enums/UserTrendsIntervalByAdmin.js";

export default class UserRepository
  extends BaseRepository<User, IUserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  protected toDomain(doc: IUserDocument): User {
    const user = doc.toObject();
    return new User(
       user.firstName,
     user.lastName,
     user.email,
     user.isBlocked,
     user.walletBalance,
     user.password?? undefined,
     user._id.toString(), 
     user.createdAt??undefined,
     user.gender??undefined,
     user.dob??undefined,
     user.profilePicture??undefined,
     user.address??undefined,
     user.isGoogleUser,
     user.googleId??undefined
    );
  }

  protected toPersistence(entity: Partial<User>): Partial<IUserDocument> {
    return {
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      password: entity.password,
      isBlocked: entity.isBlocked,
      walletBalance: entity.walletBalance,
      gender: entity.gender,
      dob: entity.dob,
      profilePicture: entity.profilePicture,
      address: entity.address,
      createdAt: entity.createdAt,
      isGoogleUser: entity.isGoogleUser,
      googleId: entity.googleId,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.model.findOne({ email });
    return user ? this.toDomain(user) : null;
  }

  async findList(dto: ListUsersDTO): Promise<User[]> {
    const { page, search, filter } = dto;
    const limit = 10;
    const skip = (page - 1) * limit;
   type UserFilter=FilterQuery<User>
    const query: UserFilter = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (filter) {
      query.isBlocked = filter === UserStatus.INACTIVE;
    }

    const users = await this.model.find(query).skip(skip).limit(limit);
    return users.map((u) => this.toDomain(u));
  }
  async fetchUserTrends(
    fromDate: Date,
    toDate: Date,
    interval: UserTrendsIntervalByAdmin
  ): Promise<UserTrendsEntry[]> {
    const dateFormat=
    interval===UserTrendsIntervalByAdmin.DAY?
       { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }:
      interval=== UserTrendsIntervalByAdmin.MONTH?
      { $dateToString: { format: "%Y-%m", date: "$createdAt" } }:
      { $dateToString: { format: "%Y", date: "$createdAt" } };
    
    const results = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: dateFormat,
          users: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return results.map((r) => ({
      label: r._id,
      users: r.users,
    }));
  }

  async fetchUserTrendsSummary(fromDate: Date, toDate: Date): Promise<UserTrendsSummary> {
    const totalPromise = this.model.countDocuments({});
    const addedPromise = this.model.countDocuments(
      {$and:[{createdAt:{$gte:fromDate}},{createdAt:{$lte:toDate}}]}
    );

    const [total, added] = await Promise.all([totalPromise, addedPromise]);

    return {
      totalValue: total,
      addedValue: added,
    };
  }
}

import { toUserDomain } from "../../../application/mappers/UserMapper";
import { ListUsersDTO } from "../../../domain/dtos/admin.dto";
import User, { UserRawDatabase } from "../../../domain/entities/user.entity";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { IUserDocument, UserModel } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";

export default class UserRepository
  extends BaseRepository<User, IUserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  protected toDomain(doc: IUserDocument): User {
    const { _id, ...userWithoutId } = doc.toObject();
    const raw: UserRawDatabase = {
      ...userWithoutId,
      id: _id.toString(),
    };
    return toUserDomain(raw);
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

    const query: any = {};
    
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

    const users = await this.model.find(query).skip(skip).limit(limit);
    return users.map((u) => this.toDomain(u));
  }
}

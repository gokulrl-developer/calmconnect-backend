import { Model, Document, FilterQuery } from "mongoose";
import IBaseRepository from "../../../domain/interfaces/IBaseRepository.js";

export abstract class BaseRepository<TDomain, TDocument extends Document>
  implements IBaseRepository<TDomain>
{
  constructor(
    protected model: Model<TDocument>
  ) {}

  protected abstract toDomain(doc: TDocument): TDomain;
  protected abstract toPersistence(entity: Partial<TDomain>): Partial<TDocument>;

  async create(item: Partial<TDomain>): Promise<TDomain> {
    const created = await this.model.create(this.toPersistence(item));
    return this.toDomain(created);
  }

  async update(id:string,item: Partial<TDomain>): Promise<TDomain | null> {
    const updated = await this.model.findByIdAndUpdate(
      id,
      this.toPersistence(item),
      { new: true }
    );
    return updated ? this.toDomain(updated) : null;
  }

  async findById(id: string): Promise<TDomain | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(filter?: Partial<TDomain>): Promise<TDomain[]> {
    const docs = await this.model.find(filter as FilterQuery<TDocument>);
    return docs.map((doc) => this.toDomain(doc));
  }

  async findOne(filter?: Partial<TDomain>): Promise<TDomain | null> {
    const doc = await this.model.findOne(filter as FilterQuery<TDocument>);
    return doc ? this.toDomain(doc) : null;
  }

  async deleteById(id: string): Promise< TDomain |null> {
    return await this.model.findByIdAndDelete(id);
  }
}

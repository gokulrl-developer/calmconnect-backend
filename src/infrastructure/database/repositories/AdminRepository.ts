import { AdminModel, IAdminDocument } from "../models/AdminModel.js";
import IAdminRepository, { AdminData } from "../../../domain/interfaces/IAdminRepository.js";

export default class AdminRepository implements IAdminRepository {

  private toAdminData(doc: IAdminDocument): AdminData {
    const admin=doc.toObject();
    return {
      email: admin.email,
      password: admin.password,
      adminId: admin._id.toString()
    };
  }

  private toPersistence(adminData: Partial<AdminData>): Partial<IAdminDocument> {
    return {
      email: adminData.email,
      password: adminData.password
    };
  }

 
  async findOne(): Promise<AdminData |null> {
    const doc = await AdminModel.findOne({});
    return doc?this.toAdminData(doc):null;
  }


  async update(adminData: Partial<AdminData>): Promise<AdminData | null> {
    const persistenceData = this.toPersistence(adminData);

    const updated = await AdminModel.findOneAndUpdate(
      {},                        
      { $set: persistenceData },
      { new: true }
    );

    return updated ? this.toAdminData(updated) : null;
  }
}

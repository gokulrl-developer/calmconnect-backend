import IAdminConfigService, { AdminData } from "../../domain/interfaces/IAdminConfigService.js";

export default class AdminConfigService implements IAdminConfigService {
  getAdminData(): AdminData {
    return {
      email: process.env.ADMIN_EMAIL!,
      adminId: process.env.ADMIN_ID!,
    };
  }
}

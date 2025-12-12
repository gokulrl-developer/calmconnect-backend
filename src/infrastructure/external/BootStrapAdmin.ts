import { AdminModel } from "../database/models/AdminModel.js";
import { hashPassword } from "../../utils/passwordEncryption.js";

export class AdminBootstrapper {
  private readonly saltRounds = 10;

  constructor() {}

  public async execute(): Promise<void> {
    const existingAdmin = await AdminModel.findOne({});
    if (existingAdmin) {
      console.log("Admin already exists in DB");
      return;
    }

    const passwordHash = await hashPassword(
      process.env.ADMIN_PASSWORD!
    );

    const admin = new AdminModel({
      email: process.env.ADMIN_EMAIL,
      password:passwordHash,
    });

    await admin.save();
    console.log(
      "Admin user created in DB. Please change password immediately!"
    );
  }
}

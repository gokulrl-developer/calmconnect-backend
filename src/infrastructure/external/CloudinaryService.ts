import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../application/error/app-error-codes";
import AppError from "../../application/error/AppError";
import { IFileStorageService } from "../../domain/interfaces/IFileStorageService";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export default class CloudinaryService implements IFileStorageService{
  async uploadFile(
    fileBuffer: Buffer,
    folder: string,
    fileName?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: fileName,
          resource_type: "auto",
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR));
          }
          resolve(result.secure_url);
        }
      );

      stream.end(fileBuffer);
    });
  }
}

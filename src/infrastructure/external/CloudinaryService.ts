import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants.js";
import { ALLOWED_LICENSE_FILE_TYPES, ALLOWED_RESUME_FILE_TYPES } from "../../application/constants/file-mime-types.constants.js";
import { AppErrorCodes } from "../../application/error/app-error-codes.js";
import AppError from "../../application/error/AppError.js";
import { IFileStorageService } from "../../domain/interfaces/IFileStorageService.js";
import cloudinary from "../config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";

export default class CloudinaryService implements IFileStorageService{
  async uploadFile(
    fileBuffer: Buffer,
    folder: string,
    mime:string,
    fileName?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const resourceType = (mime.startsWith("image/") || (ALLOWED_LICENSE_FILE_TYPES.includes(mime)) || (ALLOWED_RESUME_FILE_TYPES.includes(mime)))
    ? "image"
    : "raw";
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: fileName,
          resource_type: resourceType,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.log("error on cloudinary upload : ",error)
            return reject(new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR));
          }
          resolve(result.secure_url);
        }
      );

      stream.end(fileBuffer);
    });
  }
}

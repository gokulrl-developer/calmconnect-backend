export interface IFileStorageService {
  uploadFile(fileBuffer: Buffer, folder: string,mime:string, fileName?: string): Promise<string>;
}

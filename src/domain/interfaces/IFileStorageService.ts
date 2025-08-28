export interface IFileStorageService {
  uploadFile(fileBuffer: Buffer, folder: string, fileName?: string): Promise<string>;
}

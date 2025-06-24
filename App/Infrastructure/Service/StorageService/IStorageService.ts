export const IStorageServiceId = Symbol.for('IStorageService');
type UploadFileOptions = {
  fileStream?: any;
  filename?: string;
  gzip?: any;
};
export interface IStorageService {
  UploadFile({ fileStream, filename, gzip }: UploadFileOptions): Promise<any>;
  getFilePath(dir);
  UploadPrivateFile({ fileStream, filename, gzip }: UploadFileOptions): Promise<any>;
  getFileReadStream(srcFileName): Promise<any>;
  getFileBuffer(srcFileName): Promise<any>;
  getFileMetadata(srcFileName): Promise<any>;
  downloadFile(filename, pathToSave): Promise<any>;
  downloadPrivateFile(filename, pathToSave): Promise<any>;
  generateV4ReadSignedUrl(fileName): Promise<any>;
  uploadPdfFile(localFile: string, destFileName: string): Promise<any>;
  getFileContentAsBase64(filePath: string): Promise<any>;
}

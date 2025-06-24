export const ISftpServiceId = Symbol.for('ISftpService');

export interface ISftpService {
  uploadFile(filePath: string): Promise<any>;
}

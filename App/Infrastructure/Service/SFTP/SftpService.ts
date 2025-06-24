import { injectable } from 'inversify';
import { ISftpService } from './ISftpService';
import path from 'path';
import SFTPClient from '@infrastructure/SFTP/SftpClient';
import logger from '@infrastructure/Logger/logger';
import getYearMonthDayDirectoryRoutesForNachaFiles from '@infrastructure/Utils/getYearMonthDayDirectoryRoutes';

@injectable()
class SftpService implements ISftpService {
  private sftp: SFTPClient;
  private client: any;

  constructor() {
    this.sftp = new SFTPClient();
  }

  private async createDirectoryIfNotExists(directoryPath: string): Promise<void> {
    try {
      this.client = await this.sftp.getClient();

      const exists = await this.client.exists(directoryPath);

      if (!exists) {
        await this.client.mkdir(directoryPath, true);
      }
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(filePath: string): Promise<any> {
    await this.sftp.Connect();
    this.client = await this.sftp.getClient();

    const { yearDir, monthDir, dayDir, remoteFilePath } = getYearMonthDayDirectoryRoutesForNachaFiles(filePath, 'SFTP')

    await this.createDirectoryIfNotExists(yearDir);
    await this.createDirectoryIfNotExists(monthDir);
    await this.createDirectoryIfNotExists(dayDir);

    await this.client.put(filePath, remoteFilePath);
    await this.sftp.Disconnect();

    logger.debug(
      `Refunds file uploaded to path: ${remoteFilePath}, fileName: ${path.basename(
        filePath,
      )}`,
    );
    return remoteFilePath;
  }
}

export default SftpService;
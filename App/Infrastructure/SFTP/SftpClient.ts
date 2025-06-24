const SftpClient = require('ssh2-sftp-client');
import Config from '@infrastructure/Config';
import fs from 'fs';
const { SFTPConfig } = Config;

class SFTPClient {
  private client: any;

  constructor() {
    this.client = new SftpClient();
  }

  async Connect(): Promise<void> {
    const sftpConfig = {
      host: SFTPConfig.HOST,
      username: SFTPConfig.USERNAME,
      privateKey: fs.readFileSync(SFTPConfig.PRIVATE_KEY_PATH),
      debug: (info) => console.log('SFTP Debug:', info),
    };

    await this.client.connect(sftpConfig);
  }

  async Disconnect(): Promise<void> {
    await this.client.end();
  }

  getClient(): Promise<any> {
    return this.client;
  }
}

export default SFTPClient;

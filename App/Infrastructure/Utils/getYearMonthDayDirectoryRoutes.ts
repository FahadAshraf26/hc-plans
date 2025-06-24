import path from 'path';
import Config from "@infrastructure/Config";
const { google, SFTPConfig } = Config;

export default function getYearMonthDayDirectoryRoutesForNachaFiles(filePath: string, destination: string) {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.getDate().toString();

  const rootDir = destination == 'SFTP' ? SFTPConfig.SFTP_ROOT_NACHA_DIRECTORY : google.ROOT_NACHA_DIRECTORY;
  const yearDir = `${rootDir}/${year}`;
  const monthDir = `${yearDir}/${month}`;
  const dayDir = `${monthDir}/${day}`;
  const remoteFilePath = `${dayDir}/${path.basename(filePath)}`;

  return { yearDir, monthDir, dayDir, remoteFilePath };
}
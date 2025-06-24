import { Storage } from '@google-cloud/storage';
import config from '../../Config';
import { IStorageService } from '@infrastructure/Service/StorageService/IStorageService';
import { injectable } from 'inversify';
const { google } = config;

const StorageConfig = google;
const cloudStorage = new Storage({
  projectId: StorageConfig.PROJECT_ID,
  keyFilename: StorageConfig.GOOGLE_SERVICE_KEY_FILE,
});
const publicUploadsBucket = cloudStorage.bucket(StorageConfig.BUCKET_NAME);

const privateUploadsBucket = cloudStorage.bucket(StorageConfig.PRIVATE_BUCKET_NAME);

@injectable()
class StorageService implements IStorageService {
  async UploadFile({ fileStream, filename, gzip = true }) {
    const writeStream = publicUploadsBucket.file(filename).createWriteStream({
      resumable: false,
      gzip,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
      public: true,
    });

    return await fileStream
      .pipe(writeStream)
      .on('finish', () => true)
      .on('error', (err) => {
        throw err;
      });
  }

  getFilePath(dir) {
    return `/${StorageConfig.BUCKET_NAME}/${dir}`;
  }
  async UploadPrivateFile({ fileStream, filename, gzip = true }) {
    const writeStream = privateUploadsBucket.file(filename).createWriteStream({
      resumable: false,
      gzip,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    return await fileStream
      .pipe(writeStream)
      .on('finish', () => true)
      .on('error', (err) => {
        throw err;
      });
  }

  async getFileReadStream(srcFileName) {
    return cloudStorage
      .bucket(StorageConfig.BUCKET_NAME)
      .file(srcFileName)
      .createReadStream();
  }

  async getFileBuffer(srcFileName) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return cloudStorage.bucket(StorageConfig.BUCKET_NAME).file(srcFileName).download();
  }

  async getFileMetadata(srcFileName) {
    return cloudStorage.bucket(StorageConfig.BUCKET_NAME).file(srcFileName).getMetadata();
  }

  static async setFileMetaData(srcFileName, headers = {}) {
    return cloudStorage
      .bucket(StorageConfig.BUCKET_NAME)
      .file(srcFileName)
      .setMetadata({
        cacheControl: 'public, max-age=31536000',
        ...headers,
      });
  }

  async downloadFile(filename, pathToSave) {
    const file = publicUploadsBucket.file(filename).download({ destination: pathToSave });
    return await file;
  }

  async downloadPrivateFile(filename, pathToSave) {
    const file = privateUploadsBucket
      .file(filename)
      .download({ destination: pathToSave });
    return await file;
  }

  async generateV4ReadSignedUrl(fileName: string) {
    try {
      // Get a v4 signed URL for reading the file
      const [url] = await publicUploadsBucket.file(fileName).getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      return url;
    } catch (err) {
      throw err;
    }
  }

  async uploadPdfFile(localFile, destFileName) {
    try {
      await privateUploadsBucket.upload(localFile, {
        destination: destFileName,
      });
      privateUploadsBucket.file(destFileName);
    } catch (e) {
      throw e;
    }
  }

  async getFileContentAsBase64(filePath) {
    try {
      const file = cloudStorage.bucket(StorageConfig.BUCKET_NAME).file(filePath);
      const [fileContent] = await file.download();

      const base64Content = fileContent.toString('base64');

      return base64Content;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default StorageService;

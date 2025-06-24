import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import { inject, injectable } from 'inversify';

@injectable()
class SignedUrlController {
  constructor(@inject(IStorageServiceId) private storageService: IStorageService) {}

  getDocumentSignedUrl = async (httpRequest) => {
    const { fileName } = httpRequest.query;

    const response = await this.storageService.generateV4ReadSignedUrl(fileName);
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };
}

export default SignedUrlController;

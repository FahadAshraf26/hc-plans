import fs from 'fs';
import multer from 'multer';
import { inject } from 'inversify';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';

class CustomDiskStorage {
  getDestination;
  constructor(opts, @inject(IStorageServiceId) private storageService?: IStorageService) {
    this.getDestination = opts.destination;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err);

      this.storageService
        .UploadPrivateFile({
          fileStream: file.stream,
          filename: path,
        })
        .then((_) => cb(null, { path }))
        .catch((err) => cb(err, null));
    });
  }

  _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
  }
}

const upload = multer({
  storage: new CustomDiskStorage({
    destination: (req, file, cb) => {
      const extArray = file.mimetype.split('/');
      const extension = req.body.ext ? req.body.ext : extArray[extArray.length - 1];
      cb(
        null,
        `uploads/${file.fieldname}-${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}.${extension}`,
      );
    },
  }),
});

export default upload;

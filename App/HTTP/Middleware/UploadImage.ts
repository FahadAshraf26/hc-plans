import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import container from '@infrastructure/DIContainer/container';

const storageService = container.get<IStorageService>(IStorageServiceId);

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb('Please upload only images.', false);
  }
};

/**
 * uploads two images to gcp
 * a compressed version and an original version
 *
 */
class CustomDiskStorage {
  getDestination;

  constructor(opts) {
    this.getDestination = opts.destination;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err);
      file.filename = path;
      file.originalPath = '';

      if (file.mimetype.startsWith('image')) {
        this.handleImageUpload(req, file, path, cb);
      }
      if (file.mimetype.startsWith('video')) {
        this.handleVideoUpload(req, file, path, cb);
      }
    });
  }

  async handleImageUpload(req, file, path, cb) {
    path = `${path}_tiny.png`;
    const fileStream = file.stream;
    const streamAfterResize = fileStream.pipe(
      sharp()
        .resize(1920, null, {
          fit: sharp.fit.contain,
        })
        .webp({ quality: 90 }),
    );

    try {
      await storageService.UploadFile({
        fileStream: streamAfterResize,
        filename: path,
      });

      cb(null, { path });
    } catch (err) {
      cb(err, null);
    }
  }

  async handleVideoUpload(req, file, path, cb) {
    path = `${path}_video.mp4`;

    const fileStream = file.stream;

    try {
      await storageService.UploadFile({
        fileStream,
        filename: path,
        gzip: false,
      });

      // await
      // CloudinaryService.uploadVideo({
      //   fileStream,
      //   filename: path,
      // });

      cb(null, { path });
    } catch (err) {
      cb(err, null);
    }
  }

  _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
  }
}

const upload = () =>
  multer({
    storage: new CustomDiskStorage({
      destination: (req, file, cb) => {

        cb(
          null,
          `uploads/${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        );
      },
    }),
    fileFilter: multerFilter,
  });

export default upload();

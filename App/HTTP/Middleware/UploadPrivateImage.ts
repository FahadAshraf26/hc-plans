import fs from 'fs';
import multer from 'multer';
import StorageService from '@infrastructure/Service/StorageService/StorageService';
import sharp from 'sharp';
import {inject, injectable} from 'inversify';
import {
    IStorageService,
    IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import container from "@infrastructure/DIContainer/container";

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
const storageService = container.get<IStorageService>(IStorageServiceId)

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
        });
    }

    async handleImageUpload(
        req: any,
        file: { stream: any },
        path: string,
        cb: (arg0: any, arg1: { path: any }) => void,
    ) {
        path = `${path}_tiny.png`;
        const fileStream = file.stream;
        const streamAfterResize = fileStream.pipe(
            sharp()
                .resize(550, 550, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true,
                    position: 'entropy',
                })
                .png({quality: 100}),
        );

        try {
            await storageService.UploadPrivateFile({
                fileStream: streamAfterResize,
                filename: path,
            });

            cb(null, {path});
        } catch (err) {
            cb(err, null);
        }
    }

    _removeFile(req, file, cb) {
        fs.unlink(file.path, cb);
    }
}

const upload = multer({
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

export default upload;

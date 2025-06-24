import http from 'http';
import { inject, injectable } from 'inversify';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';

@injectable()
class MediaController {
  constructor(@inject(IStorageServiceId) private storageService: IStorageService) {}
  serveMedia = async (req, res) => {
    const { mediaDir, mediaPath } = req.params;

    const url =
      'http://storage.googleapis.com' +
      this.storageService.getFilePath(mediaPath ? `${mediaDir}/${mediaPath}` : mediaDir);
    const { host, 'user-agent': userAgent, ...requestheaders } = req.headers;
    const options = {
      port: 80,
      method: req.method,
      headers: requestheaders,
    };

    const proxy = http.request(url, options, function (proxyRes) {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);

      if (proxyRes.statusCode >= 400) {
        return res.end();
      }

      proxyRes.pipe(res, {
        end: true,
      });
    });

    return req.pipe(proxy, { end: true });
  };
}

export default MediaController;

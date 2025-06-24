import handleError from './handleError';
import express from 'express';
import { RequestOrigin } from '../../Domain/Core/ValueObjects/RequestOrigin';

/**
 * @typedef {{body:object,headers?:object,statusCode?:number,isStream?:boolean}} HttpResponse
 */

const makeExpressCallback = (controller) => {
  return (req, res) => {
    const httpRequest = makeHttpRequest(req);
    controller(httpRequest)
      .then((httpResponse) => {
        const isStream = httpResponse.isStream || false;
        const headers = httpResponse.headers || {
          'Content-Type': 'application/json',
        };
        
        const statusCode = httpResponse.statusCode || 200;

        res.set(headers);

        if (isStream) {
          return httpResponse.body.pipe(res);
        }

        return res.status(statusCode).send(httpResponse.body);
      })
      .catch((err) => {
        handleError(err, res, req);
      });
  };
};

/**
 * @typedef {{files?: object[],file?:object,body:object,query:object,params:object,ip:string,method:string,path:string,headers:object,user?:object,adminUser?:object,decoded?:object,userId:string,isAdminRequest:boolean}} HttpRequest
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {HttpRequest}
 */
function makeHttpRequest(req) {
  
  return {
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    method: req.method,
    path: req.path,
    headers: {
      'Content-Type': req.get('Content-Type'),
      Referer: req.get('referer'),
      'User-Agent': req.get('User-Agent'),
      'Access-Control-Allow-Origin': '*',
      'x-recaptcha-token': req.headers['x-recaptcha-token'],
      // 'req-platform': req.headers['req-platform']
    },
    user: req.user,
    adminUser: req.adminUser,
    files: req.files,
    file: req.file,
    clientIp: req.clientIp,
    decoded: req.decoded,
    userId: req.decoded
      ? req.decoded.userId
      : req.adminUser && req.params.userId
      ? req.params.userId
      : null,
    isAdminRequest: req.query.requestOrigin
      ? req.query.requestOrigin === RequestOrigin.ADMIN_PANEL && !!req.adminUser
      : false,
  };
}

export default makeExpressCallback;

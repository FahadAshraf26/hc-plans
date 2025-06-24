import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import compressionMiddleware from '../Middleware/compression';
import overloadMiddleware from '../Middleware/overload';
import helmet from 'helmet';
import requestIp from 'request-ip';
import 'reflect-metadata';

const app = express();

app.use(cors());
// app.use(overloadMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());
logger.token('ip', (req, _) => req.clientIp);
app.use(logger(':method :url :status :response-time ms - :res[content-length] :ip'));
app.use(compressionMiddleware);
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors());
app.use('*', function (req, res, next) {
  next();
});

export default app;

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

import passportMiddleware from './passportMiddleware';
import prismaMiddleware from './prismaMiddleware';
import authencationMiddleware from './authencationMiddleware';

const {
  WEB_CLIENT_HOST
} = process.env;

const middlewares = (app: express.Application) => {
  // console.log('> ', app.use)
  app.use(cookieParser());
  app.use(bodyParser.json());

  // ===== passport 
  passportMiddleware(app);

  // ===== prisma
  app.use(prismaMiddleware);

  // ===== 인증 정보
  app.use(authencationMiddleware);

  // ===== cors
  app.use(cors({
    origin: WEB_CLIENT_HOST,
    credentials: true
  }))
};

export default middlewares;
import * as express from 'express';
import * as bodyParser from 'body-parser';

import passportMiddleware from './passportMiddleware';
import prismaMiddleware from './prismaMiddleware';

const middlewares = (app: express.Application) => {
  // console.log('> ', app.use)
  app.use(bodyParser.json());

  // ===== passport 
  passportMiddleware(app);

  // ===== prisma
  app.use(prismaMiddleware)
};

export default middlewares;
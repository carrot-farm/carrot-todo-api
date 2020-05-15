import * as express from 'express';
import { PrismaClient } from '@prisma/client';

// ===== prisma 인스턴스
const prisma = new PrismaClient();

// ===== 미들웨어 정의
const prismaMiddleware = (
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => {
  req.prisma = prisma;
  next()
};

export default prismaMiddleware;
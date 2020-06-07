import { PrismaClient } from '@prisma/client';

import { TTokenInfo } from './authenticate';

declare global {
  namespace Express {
    // # 유저 정보
    interface User {
      id: number;
    }

    // # 리퀘스트 객체
    interface Request {
      prisma: PrismaClient;
      user?: User;
      tokenInfo?: TTokenInfo
    }
  }
}

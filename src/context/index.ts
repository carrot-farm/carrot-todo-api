import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { verify } from 'jsonwebtoken';

const { TOKEN_SECRET } = process.env;
const prisma = new PrismaClient(); // 프리스마
const pubsub = new PubSub(); // 구독을 위한 pubsub

// ===== type 정의
// # context 타입 정의
export type TContextCreator = {
  prisma: PrismaClient;
  pubsub: PubSub;
  user?: object | string;
};

// ===== context 생성 함수
export function context(request: ContextParameters): TContextCreator {
  const authorization = request.request.headers.authorization;
  const user = authorization ? getUser(authorization!, TOKEN_SECRET!) : undefined;
  return {...request, prisma, pubsub, user };
};

// ===== 유저 정보 반환
const getUser = (authorization: string, secret: string) => {
  try {
    return verify(authorization, secret);
  } catch(e) {
    return undefined;
  }
}
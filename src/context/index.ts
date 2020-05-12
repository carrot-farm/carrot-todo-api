import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';

const prisma = new PrismaClient(); // 프리스마
const pubsub = new PubSub(); // 구독을 위한 pubsub

// ===== type 정의
export type TContextCreator = {
  prisma: PrismaClient;
  pubsub: PubSub;
}

// ===== context 생성 함수
export function context(request: ContextParameters): TContextCreator {
  return {...request, prisma, pubsub };
}
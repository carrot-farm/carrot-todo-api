import { ContextParameters } from 'graphql-yoga/dist/types';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-yoga';

// # context 타입 정의
export type TContextCreator = ContextParameters &  {
  /** prisma 인스턴스 */
  prisma: PrismaClient;
  /** pubsub */
  pubsub: PubSub;
};
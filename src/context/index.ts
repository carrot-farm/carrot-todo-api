import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { verify } from 'jsonwebtoken';
import * as express from 'express';

const { TOKEN_SECRET } = process.env;
export const prisma = new PrismaClient(); // 프리스마
const pubsub = new PubSub(); // 구독을 위한 pubsub

// ===== type 정의


// ===== context 수정 함수
export function context(request: ContextParameters): TContext {
  return {...request, prisma, pubsub };
};

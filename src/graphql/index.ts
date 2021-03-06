import { nexusPrismaPlugin } from 'nexus-prisma';
import { makeSchema, fieldAuthorizePlugin } from '@nexus/schema';

import todo_category from './models/todo_category';
import user from './models/user';
// import todo_category from './models/todo_category';
import todo from './models/todo';
import Query from './Query';
import Mutation from './Mutation';

// ===== 스키마 생성
export const schema = makeSchema({
  types: [Query, Mutation, user, todo_category, todo],
  plugins: [
    nexusPrismaPlugin(), 
    fieldAuthorizePlugin()
  ],
  outputs: {
    schema: `${process.env.PWD}/src/schema/schema.graphql`,
    // typegen: `${process.env.PWD}/src/schema/generated/nexus.ts`,
    typegen: `${process.env.PWD}/node_modules/@types/nexus-typegen/index.d.ts`,
  },
  typegenAutoConfig: {
    // contextType: 'Context.TContextCreator', // context 타입 위치
    contextType: 'TContext', // context 타입 정의
    sources: [ // context 소스 정의
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('../context'),
        alias: 'Context',
      },
    ],
  },
})

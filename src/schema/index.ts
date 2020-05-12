import { nexusPrismaPlugin } from 'nexus-prisma';
// import { schema } from 'nexus';
import { makeSchema, objectType } from '@nexus/schema';

// ===== db 관련 스키마 정의
const link = objectType({
  name: 'link',
  definition(t) {
    t.model.id();
    t.model.description();
    t.model.url();
    t.model.userId();
  }
});

const user = objectType({
  name: 'user',
  definition(t) {
    t.model.email();
    t.model.id();
    t.model.name();
    t.model.password();
    t.model.link({
      pagination: true
    });

  }
})

// ===== 쿼리
const Query = objectType({
  name: 'Query',
  definition(t) {
    t.string('info', { 
      resolve: () => 'hello',
      description: '테스트' 
    })
  },
})


export const schema = makeSchema({
  types: [Query, link, user],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: __dirname + '/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'Context.TContextCreator', // context 타입 위치
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
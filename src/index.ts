require('dotenv').config({
  path: `${process.env.PWD}/env/.env.${process.env.NODE_ENV}`
});
import { GraphQLServer } from 'graphql-yoga';
import { context } from './context';
import { schema } from './schema';

// ==== 환경변수
const { PORT: port } = process.env;

// console.log("> ", process.env.NODE_ENV)

// ===== 서버 인스턴스 생성
const server = new GraphQLServer({
  schema,
  context
});

// ===== express route 설정
server.express.get('/test', (req, res) => {
  res.send('hello')
});

// ===== 서버 시작
server.start({ port }, () => console.log(`> server start ${port}`))
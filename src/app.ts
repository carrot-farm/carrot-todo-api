require('dotenv').config({
  path: `${process.env.PWD}/env/.env.${process.env.NODE_ENV}`
});
import { GraphQLServer } from 'graphql-yoga';

import { context } from './context';
import { schema } from './graphql';
import middlewares from './middlewares';
import permissionMiddleware from './middlewares/permissionMiddleware'
import api from './api';
import { server } from 'typescript';

// ==== 환경변수
const { PORT, HOST } = process.env;
let isDisableKeepAlive = false; // keep-alive 비활성화 플래그.

// ===== 서버 인스턴스 생성
const graphqlServer = new GraphQLServer({
  schema,
  context,
  middlewares: [permissionMiddleware]
});

// ===== express
// # 미들웨어
middlewares(graphqlServer.express);
// # route 설정
graphqlServer.express.use('/api', api);

// ===== 서버 시작
const servrOptions = {
  port: PORT,
  cors: {
    credentials: true,
    origin: HOST
  },
  debug: true,
  // playground: '/playground',
}
const server = graphqlServer.start(servrOptions, () => console.log(`> server start ${PORT}`))

// ===== 시작 후 관련 처리
server.then(function paran(s: any) {
  
  // ===== SIGINT 이벤트 리스닝
  process.on('SIGINT', () => {
    // # keep-alive 비활성화
    isDisableKeepAlive = true;
  
    // # 새로운 요청을 받기 않게 앱 종료
    s.close(function() {
      console.log('server closed');
      process.exit(0); //
    });
  });
})
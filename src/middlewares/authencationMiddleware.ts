import * as express from 'express';
import * as jwt from 'jsonwebtoken';

// ===== 변수
const {
  TOKEN_SECRET
} = process.env;

// ===== 토큰 인증
const authencateMiddleware = (
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => {
  req.user = undefined;
  if(!req.cookies.accessToken) {
    return next();
  }
  // console.log('> ', req.cookies.accessToken)
  // # 토큰 정보 디코디드
  const tokenInfo:any = jwt.verify(req.cookies.accessToken.split('Bearer ')[1], TOKEN_SECRET!);

  // # 유저 정보 셋팅
  req.user = {
    id: tokenInfo && tokenInfo.userId
  }
  next();
}

export default authencateMiddleware;
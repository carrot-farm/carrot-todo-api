import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { TContextCreator } from '../types/context';
import { REISSUE_TOKEN } from '../const';
import { reissueToken } from '../utils/authencationUtils'

// ===== 변수
const {
  TOKEN_SECRET,
  TOKEN_REFRESH_SECRET
} = process.env;

// ===== express middleware
const authencateMiddleware = (
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => {
  // console.log('> express ')
  if(!req.cookies.accessToken) {
    return next();
  }

  // # 토큰 정보 디코디드
  const tokenInfo:any = jwt.verify(req.cookies.accessToken.split('Bearer ')[1], TOKEN_SECRET!);

  // # 유저 정보 셋팅
  if(tokenInfo) {
    req.tokenInfo = tokenInfo;
    req.user = {
      id: tokenInfo.userId
    }
  }
  next();
}

// ===== graphql middleware
export const graphqlAuthorization = async (
  resolve: any, 
  root: any, 
  args: any,
  ctx: TContextCreator,
  info: any
) => {
  const req = ctx.request;
  
  // # 악세스 토큰 만료시 새로 발급
  if(!req.cookies.accessToken && req.cookies.refreshToken) {
    await reissueToken(ctx);
  }

  // # 토큰 새로 발급
  if(req.cookies.accessToken && !req.user) {
    const tokenInfo:any = jwt.verify(req.cookies.accessToken.split('Bearer ')[1], TOKEN_SECRET!);
    if(tokenInfo) {
      req.tokenInfo = tokenInfo;
      req.user = {
        id: tokenInfo.userId
      }
    }
  }
  
  const result = await resolve(root, args, ctx, info);
  return result;
};

export default authencateMiddleware;
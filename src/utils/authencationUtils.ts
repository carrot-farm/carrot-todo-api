import { sign, verify } from 'jsonwebtoken';
import * as express from 'express';

import { TTokenPublish, TTokenInfo, TTokenUserInfo, TTokenType } from '../types/authenticate';
import { calculationDate } from '../utils/dateUtil'

// ===== 환경 변수
const {
  TOKEN_SECRET,
  TOKEN_ISSUER,
  TOKEN_SUBJECT,
  TOKEN_EXPIRES_IN
} = process.env;

/** 
 * 토큰을 발행한다.
 */
export const tokenPublish = (data: object = {}, options = {}): string => {
  const {
    issuer = TOKEN_ISSUER,
    subject = TOKEN_SUBJECT,
    expiresIn,
    secret = TOKEN_SECRET,
  }: TTokenPublish = options;

  const token = sign(data, secret!, {
    issuer,
    subject,
    expiresIn,
  })

  return token;
};

/** 토큰을 복호화 */
export const tokenDecode = <T>(token: string, secret: string) => {
  const decoded = verify(token, secret);

  return decoded;
};


/** 쿠키로 토큰 발행 */
type TIssueTokenCookieParams = {
  /** 토큰에 넣을 데이터 */
  data: TTokenUserInfo;
  /** request 객체 */
  req: express.Request;
  /** response 객체 */
  res: express.Response;
};
export const issueTokenCookie = async (tokenType: TTokenType, {
  data,
  req,
  res,
}: TIssueTokenCookieParams): Promise<string> => {
  const date = new Date();
  let tokenExp = calculationDate(date, 30, 'minutes'); // 토큰 유효기간
  
  // # 토큰 유효기간
  if(tokenType === 'refreshToken') {
    tokenExp = calculationDate(date, 14, 'date');
  } else if(tokenType === 'disposableToken') {
    tokenExp = calculationDate(date, 3, 'minutes');
  }

  // # 토큰 생성
  const token = tokenPublish(data, {
    subject: tokenType,
    secret: TOKEN_SECRET,
    expiresIn: '30m',
  });

  // # 리프레시 토큰 저장
  if(tokenType === 'refreshToken') {
    await req.prisma.refresh_token.create({
      data: {
        refresh_token: token,
        expires_time: Math.floor(tokenExp / 1000),
        user: {
          connect: { id: data.userId }
        }
      }, 
    });
  }
  
  // # 토큰 발행
  res.cookie(tokenType, `Bearer ${token}`, {
    expires: new Date(tokenExp),
    httpOnly: true,
    sameSite: true
  });

  return token;
}
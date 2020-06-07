import { sign, verify } from 'jsonwebtoken';
import * as express from 'express';

import { TTokenPublish, TTokenInfo, TTokenUserInfo, TTokenType } from '../types/authenticate';
import { TContextCreator } from '../types/context';
import { calculationDate } from '../utils/dateUtil';


// ===== 환경 변수
const {
  TOKEN_SECRET,
  TOKEN_ISSUER,
  TOKEN_SUBJECT,
  TOKEN_EXPIRES_IN,
  TOKEN_REFRESH_SECRET
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
  const bearerToken = `Bearer ${token}`;
  res.cookie(tokenType, bearerToken, {
    expires: new Date(tokenExp),
    httpOnly: true,
    sameSite: true
  });

  return bearerToken;
};


// ===== 악세스 토큰 재발급
export const reissueToken = async (ctx: TContextCreator) => {
  const req = ctx.request;
  const res = ctx.response;
  const refreshToken = req.cookies.refreshToken && req.cookies.refreshToken.split('Bearer ')[1];
  const date = new Date();

  // console.log('> call reissueToken')

  // # refresh token이 없을 때
  if(!refreshToken) {
    throw new Error('not found refresh token');
  }
  
  try {
    const tokenInfo: any = verify(refreshToken, TOKEN_REFRESH_SECRET!);
    
    const now = Math.floor(date.getTime() / 1000);
    const diff = Math.floor((tokenInfo.exp - now) / 60 / 60); // 유효기간 중 남은 시간(시)
    

    // # db에서 유효 토큰 찾기
    const dbTokens = await req.prisma.refresh_token.findMany({
      where: {
        user_pk: tokenInfo.userId,
        expires_time: {
          gte: now
        },
        refresh_token: {
          equals: refreshToken
        }
      },
    });

    // # db에 해당 토큰이 없으면 에러
    if(!dbTokens.length) {
      throw new Error('invalid refresh token');
    }

    // # accessToken 발급
    req.cookies.accessToken = await issueTokenCookie('accessToken', {
      data: {
        userId: tokenInfo.userId
      },
      req,
      res
    });
    
    
    // # 리프레시 토큰 유효기시간이 5시간 미만일 경우 재발급
    if(diff < 5) {
      // # refresh accessToken 발급
      req.cookies.refreshToken = await issueTokenCookie('refreshToken', {
        data: {
          userId: tokenInfo.userId
        },
        req,
        res
      });
    }
    
    // console.log(tokenInfo, now, diff, dbTokens);
    return true;
  } catch(e) {
    // console.error(e)
    res.cookie('accessToken', '', { maxAge: -1 });
    res.cookie('refreshToken', '', { maxAge: -1 });
    throw new Error('invalid refresh token');
  }
};




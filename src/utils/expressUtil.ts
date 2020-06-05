import * as express from 'express';
import { sign, verify } from 'jsonwebtoken';

import { TTokenPublish, TTokenInfo } from '../types/authenticate';

// ===== 환경 변수
const {
  TOKEN_SECRET,
  TOKEN_ISSUER,
  TOKEN_SUBJECT,
  TOKEN_EXPIRES_IN
} = process.env;

/**
 * 아이피 가져오기
 */
export const getIp = (req: express.Request): string => {
  let ip = req.headers['x-forwarded-for'];
  if(!ip) {
    ip = req.connection.remoteAddress;
  }
  // console.log('> ', ip)
  if(typeof ip === 'object') {
    ip = ip[0]
  }
  return ip || '';
}


/** 오픈 윈도우로 열려있는 화면을 닫으면서 데이터를 넘긴다. */
export const closeWindow = (res: express.Response, token: string, error = false) => {
  const sendData = {
    type: 'login',
    token,
    error
  };
  
  res.send(`<script>
    window.opener.postMessage(${JSON.stringify(sendData)}, "*");
    window.close();
  </script>`);
  // res.send(JSON.stringify(sendData));
};


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
}
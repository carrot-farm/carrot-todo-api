import * as passport from "passport";
import * as express from 'express';
import * as JWTPassport from "passport-jwt";
import * as googleOauth from 'passport-google-oauth'

import { PrismaClient } from '@prisma/client';

// ===== prisma 인스턴스
const prisma = new PrismaClient();


// ===== 설정
const {
  TOKEN_SECRET: tokenSecret,
  TOKEN_REFRESH_SECRET: refreshTokenSecret,
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLINET_SECRET: googleClientSecret,
  HOST: host
} = process.env;


// ===== jwt 인증 전략
// const useJWT = () => {
//   const { Strategy, ExtractJwt } = JWTPassport;

//   passport.use(
//     "jwt",
//     new Strategy(
//       {
//         jwtFromRequest: ExtractJwt.fromHeader("Authorization"), // 토큰의 헤더 지정.
//         secretOrKey: tokenSecret
//       },
//       (payload, done) => {
//         // console.log('> jwt : ')
//         done(null, payload);
//       }
//     )
//   );
// };

// ===== google 인증 전략
const useGoogle = () => {
  const Strategy = googleOauth.OAuth2Strategy;
  // console.log('> ', `${host}/api/auth/google/callback`)
  // # 구글
  const strategy = new Strategy({
      clientID: googleClientId!,
      clientSecret: googleClientSecret!,
      callbackURL: `/api/auth/google/callback`,
    }, async (token, _, profile, done) => {
      const { emails } = profile;
      const email = (emails && emails.length) ? emails[0].value : '';
      // console.log('> useGoogle ', );
      try {
        done(null, { provider: 'google', email, token });
      } catch(e) {
        done(false, null, {
          message: e.message
        });
      }
    }
  )

  // # 적용
  passport.use('google', strategy);
};

// ===== 미들웨어
const passportMiddleware = (app: express.Application) => {
  app.use(passport.initialize());

  // useJWT();
  useGoogle();
};

export default passportMiddleware
import * as express from 'express';
import * as passport from 'passport';
import { AuthenticateType } from '../../types/authenticate';

import { getIp, tokenPublish, closeWindow } from '../../utils/expressUtil';


// ===== 구글 로그인
export const googleLogin = (
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};


// ===== 구글 로그인 콜백
export const googleLoginCallback = (
  req: express.Request, 
  res: express.Response, 
) => {  

  passport.authenticate('google', async (_, data: AuthenticateType, error) => {
    // console.log('> ===== 2 : ', data);
    const clientIp = getIp(req);
    let user;
    try {
      // # 유저 정보 찾기
      user = await req.prisma.user.findOne({
        where: {
          user_id: data.email,
        },
        select: {
          id: true
        }
      });
      // console.log('> user : ', user);

      if (!user) {
        // # 유저 정보 등록
        user = await req.prisma.user.create({
          data: {
            user_id: data.email,
            email: data.email,
            password: '',
            password_salt: '',
            register_log: {
              create: {
                register_ip: clientIp
              }
            },
            login_log: {
              create: {
                login_ip: clientIp
              }
            },
            oauth: {
              create: {
                provider: data.provider!,
                access_token: data.token!
              }
            }
          }
        })
        // console.log('> signup : ', user)
      }

      // # 토큰 생성
      const token = tokenPublish(user.id);

      // # 로그인 윈도우 닫기
      closeWindow(res, token);
    } catch (e) {
      console.error(e);
      closeWindow(res, '', true);
    }
  })(req, res);
};


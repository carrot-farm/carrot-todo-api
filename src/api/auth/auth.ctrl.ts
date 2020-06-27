import * as express from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';


import { TTokenPublish } from '../../types/authenticate'
import { AuthenticateType } from '../../types/authenticate';
import { getIp, tokenPublish, closeWindow } from '../../utils/expressUtil';
import { calculationDate } from '../../utils/dateUtil';

// ===== 변수
const {
  TOKEN_DISPOSABLE_SECRET,
  TOKEN_SECRET,
  TOKEN_REFRESH_SECRET,
} = process.env;

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
    // console.log('> google data : ', data);
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
            is_withdraw: 0,
            is_block: 0,
            is_verify: 0,
            register_log: {
              create: {
                register_ip: clientIp,
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
      } else {
        // # 로그인 기록 생성
        await req.prisma.login_log.create({
          data: {
            login_ip: clientIp,
            user: {
              connect: { id: user.id }
            }
          }
        })
      }
      
      // # 일회용 토큰 생성
      const token = tokenPublish({ userId: user.id }, {
        subject: 'disposableToken',
        expiresIn: '1m',
        secret: TOKEN_DISPOSABLE_SECRET
      });
      // console.log('> token : ', token)

      // # 로그인 윈도우 닫기
      closeWindow(res, token);
    } catch (e) {
      console.error(e);
      closeWindow(res, '', true);
    }
  })(req, res);
};

// ====== access/refresh 토큰 발급
export const publishTokens = async (req: express.Request, res: express.Response) => {
  try {
    if(!req.headers.authorization) {
      throw new Error('invalid token');
    }
    const date = new Date();
    const refreshTokenExp = calculationDate(date, 14, 'date');
    const accessTokenExp = calculationDate(date, 30, 'minutes');
    // console.log('> refreshToken', refreshTokenExp)
    
    // # 일회용 토큰 디코드
    const decoded: any = jwt.verify(req.headers.authorization, TOKEN_DISPOSABLE_SECRET!);

    // # access token 생성
    const accessToken = tokenPublish({ 
      userId: decoded.userId, 
    }, {
      subject: 'accessToken',
      secret: TOKEN_SECRET,
      expiresIn: '30m',
    });

    // # refresh token 생성
    const refreshToken = tokenPublish({ 
      userId: decoded.userId,
    }, {
      subject: 'refreshToken',
      secret: TOKEN_REFRESH_SECRET,
      expiresIn: '14d'
    });

    // # refresh token 저장
    await req.prisma.refresh_token.create({
      data: {
        refresh_token: refreshToken,
        expires_time: Math.floor(refreshTokenExp / 1000),
        user: {
          connect: { id: decoded.userId }
        }
      }, 
    })

    // console.log('> exp\n', new Date(accessTokenExp).toLocaleString(), 
    //   '\n', new Date(refreshTokenExp).toLocaleString()
    // )

    // # access token 반환
    res.cookie('accessToken', accessToken, {
      expires: new Date(accessTokenExp),
      httpOnly: true,
      sameSite: true
    });

    // # refresh token 반환
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(refreshTokenExp),
      httpOnly: true,
      sameSite: true
    });

    res.json({code: 'success'});
  } catch(error) {
    console.error('> publishTokens Error :\n', error.message);
    res.status(401).send({ 
      code: error.message
    })
  }
};



import { schema } from 'nexus';
import * as jwt from 'jsonwebtoken';

// import userQuery from './queries/userQuery';
import { TTokenInfo } from '../types/authenticate';
import todoQuery from './queries/todoQuery';
import { tokenDecode, tokenPublish, issueTokenCookie } from '../utils/authencationUtils';
import { calculationDate } from '../utils/dateUtil';
import { createTextChangeRange } from 'typescript';


// ===== 환경 변수
const { 
  TOKEN_DISPOSABLE_SECRET,
  TOKEN_SECRET,
  TOKEN_REFRESH_SECRET,
} = process.env;

// ===== 쿼리
const Query = schema.queryType({
  definition(t) {
    // ===== 테스트
    t.string('info', { 
      description: '테스트',
      resolve: () => 'hello',
    })

    // userQuery(t);?

    // todoQuery(t);

    t.crud.todoCategories({
      ordering: true,
      filtering: true,
      pagination: true
    });
    t.crud.todoCategory();
  
    t.crud.todo();
    t.crud.todos({
      ordering: true,
      filtering: {
        is_completed: false,
      },
      pagination: true
    });

    // ===== 인증 관련
    // # Access/Refresh 토큰 발급
    t.boolean('getTokens', {
      description: 'Access/Refresh 토큰 발급',
      resolve: async (_, __, ctx) => {
        const req = ctx.request;
        const res = ctx.response;
        const date = new Date();
        const refreshTokenExp = calculationDate(date, 14, 'date');
        const accessTokenExp = calculationDate(date, 30, 'minutes');

        try {
          // # 토큰이 업을 경우
          if(!req.headers.authorization) {
            throw new Error('notdefiend token');
          }
  
          // # 일회용 토큰 추출
          const disposableToken: string = req.headers.authorization?.split('Bearer ')[1];
          if(!disposableToken) {
            throw new Error('invalid token');
          }
          const tokenInfo: any = jwt.verify(disposableToken, TOKEN_DISPOSABLE_SECRET!);

          // # access token 생성
          const accessToken = tokenPublish({ 
            userId: tokenInfo.userId, 
          }, {
            subject: 'accessToken',
            secret: TOKEN_SECRET,
            expiresIn: '30m',
          });

          // # refresh token 생성
          const refreshToken = tokenPublish({ 
            userId: tokenInfo.userId,
          }, {
            subject: 'refreshToken',
            secret: TOKEN_REFRESH_SECRET,
            expiresIn: '14d'
          });

          // # refresh token db 저장
          await req.prisma.refresh_token.create({
            data: {
              refresh_token: refreshToken,
              expires_time: Math.floor(refreshTokenExp / 1000),
              user: {
                connect: { id: tokenInfo.userId }
              }
            }, 
          });

          // # access token 반환
          res.cookie('accessToken', `Bearer ${accessToken}`, {
            expires: new Date(accessTokenExp),
            httpOnly: true,
            sameSite: true
          });

          // # refresh token 반환
          res.cookie('refreshToken', `Bearer ${refreshToken}`, {
            expires: new Date(refreshTokenExp),
            httpOnly: true,
            sameSite: true
          });

          // console.log('> getToken: \n', accessToken, refreshToken);
          
          return true;
        } catch(e) {
          throw new Error('invalid token');
        }
      }
    });

    // # accessToken 재발급
    t.boolean('reissueToken', {
      description: 'accessToken 재발급',
      resolve: async (_, __, ctx) => {
        const req = ctx.request;
        const res = ctx.response;
        const refreshToken = req.cookies.refreshToken && req.cookies.refreshToken.split('Bearer ')[1];
        const date = new Date();

        // # refresh token이 없을 때
        if(!refreshToken) {
          throw new Error('not found refresh token');
        }
        
        try {
          const tokenInfo: any = jwt.verify(refreshToken, TOKEN_REFRESH_SECRET!);
          
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
          issueTokenCookie('accessToken', {
            data: {
              userId: tokenInfo.userId
            },
            req,
            res
          })
          
          
          // # 리프레시 토큰 유효기시간이 5시간 미만일 경우 재발급
          if(diff < 5) {
            // # refresh accessToken 발급
            issueTokenCookie('refreshToken', {
              data: {
                userId: tokenInfo.userId
              },
              req,
              res
            })
          }
          
          
          // console.log(tokenInfo, now, diff, dbTokens);
          return true;
        } catch(e) {
          console.error(e)
          res.cookie('accessToken', '', { maxAge: -1 });
          res.cookie('refreshToken', '', { maxAge: -1 });
          throw new Error('invalid refresh token');
        }
      }
    })

    // # 인증에러 테스트
    t.boolean('testInvalidToken', {
      description: '인증 에러시',
      authorize: () => false,
      resolve: () => {
        console.log('> testInvalidToken:', )
        return true; 
      }
    });
    
    // # 토큰 확인
    t.field('checkToken', {
      type: 'String',
      resolve: (_, __, ctx ) => {
        const accessToken = ctx.request.cookies.accessToken;
        const refreshToken = ctx.request.cookies.refreshToken;
        return `AccessToken: ${accessToken} ======= RefreshToken: ${refreshToken}`;
      }
    })

    // # 토큰 삭제
    t.boolean('removeToken', {
      description: '토큰 삭제',
      args: {
        tokenType: schema.stringArg(),
      },
      resolve: (_, { tokenType }, ctx) => {
        if(tokenType) {
          ctx.response.cookie(tokenType, '', {
            maxAge: -1
          });
        }
        return true;
      }
    })

    // # 유저 정보
    t.field('myInfo', {
      description: '유저 정보 가져오기',
      type: 'user',
      authorize: (root, args, ctx: any) => {
        return !!(ctx.request.user && ctx.request.user.id)
      },
      // 데이터를 찾아와 반환한다.
      resolve: async (root, args, ctx: any, info): Promise<any> => {
        const me = await ctx.prisma.user.findOne({
          where: {
            id: ctx.request.user.id
          },
          select: {
            id: true,
            user_id: true,
            email: true
          }
        })

        return me;
      },
    })
    // t.list.field('users', {
    //   type: 'user',
    //   resolve: async (parent, args, ctx) => {
    //     await ctx.prisma.user.findMany()
    //     return true;
    //   }
    // });
    // t.crud.users({
    //   pagination: true
    // });

  }
})

export default Query;
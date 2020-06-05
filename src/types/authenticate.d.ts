/**
 * passprot 인증 후 받을 수 있는 타입
 */
export type AuthenticateType = {
  email: string;
  provider: string;
  token: string;
}

/**토큰의 타입 */
export type TTokenType = 'accessToken'|'refreshToken'|'disposableToken';


// ===== 토큰 발행 시 필요 파라메터
export type TTokenPublish = {
  /** 토큰 발행자 */
  issuer?: string;
  /** 토큰 제목 */
  subject?: string;
  /** 토큰 유효기간(ms 모듈타입) */
  expiresIn?: string | number;
  /** 토큰 시크릿 */
  secret?: string;
};

/** 토큰정보 */
export type TTokenInfo = TTokenUserInfo & {
  /** 생성시간 */
  iat: number;
  /** 만료시간 */
  exp: number;
  /** 발행자 */
  iss: string;
  /** 제목 */
  sub: string;
};

/** 토큰의 유저 정보 */
export type TTokenUserInfo = {
  userId: number;
}


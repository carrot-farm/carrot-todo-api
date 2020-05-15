/**
 * passprot 인증 후 받을 수 있는 타입
 */
export type AuthenticateType = {
  email: string;
  provider: string;
  token: string;
}
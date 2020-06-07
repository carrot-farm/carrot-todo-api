import { NOT_AUTHORIZED } from '../const';
import { TContextCreator } from '../types/context';

// ===== `t.crud` 에서 유저 정보 연결시 사용.
type TConnectUser = {
  /** 컨텐스트 객체 */
  ctx: TContextCreator
}
/**
 * `t.crud` 에서 유저 정보 연결시 사용.
 */
export const connectUser = ({ ctx }: TConnectUser) => {
  if(!ctx.request.user) {
    throw new Error(NOT_AUTHORIZED);
  }
  return ({
    connect: {
      id: ctx.request.user.id
    }
  })
}
/**
 * graphql yoga에서 사용될 미들웨어
 */
import { rule, shield, and, or, not } from 'graphql-shield';

import { TContextCreator} from '../context'


// ===== 제한 정의
// # 회원
const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent: any, args: any, ctx: TContextCreator, info: any) => {
    return !!ctx.user
  },
)

// ===== 미들웨어
const permissionMiddleware = shield({
  Mutation: {
    createOnetodo_category: isAuthenticated,
    updateOnetodo_category: isAuthenticated,

    createOnetodo: isAuthenticated,
    updateOnetodo: isAuthenticated,
  },
  Query: {
    user: isAuthenticated,

    todoCategories: isAuthenticated,
    todoCategory: isAuthenticated,

    todo: isAuthenticated,
    todos: isAuthenticated,
  }
});



export default permissionMiddleware
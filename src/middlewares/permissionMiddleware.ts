/**
 * graphql yoga에서 사용될 미들웨어
 */
import { NOT_AUTHORIZED } from '../const';
import { rule, shield, and, or, not } from 'graphql-shield';

// import { TContext} from '../context'


// ===== 제한 정의
// # 로그인
const isLoggedIn = (parent: any, args: any, ctx: TContext, info: any, currentInfo: any, ) => {
  return !!ctx.request.user
}
// # 나의 
const ownOperation = (userPkField: string) => (parent: any, args: any, ctx: TContext, info: any, currentInfo: any, ) => {
  if(!ctx.request.user || (ctx.request.user.id !== parent[userPkField])) {
    throw new Error(NOT_AUTHORIZED)
  }
}

// ===== 권한
const rules = {
  query: {
    categoriesAll: isLoggedIn,
    // categoriesAll: myOwnQuery,
    // myInfo: myOwnQuery,
    todoCategory: ownOperation('user_pk'),
    todoCategories: ownOperation('user_pk'),
    todos: ownOperation('user_pk'),
    todo: ownOperation('user_pk'),
  },
  mutation: {
    createOnetodo: ownOperation('user_pk'),
    updateOnetodo: ownOperation('user_pk'),
    deleteOnetodo: ownOperation('user_pk'),
  }
}

// ===== 이터레이터 실행함수
const run = (f: (a: any) => any, iter: any) => {
  const next = iter.next();
  const value = next.value;
  // console.log('> run', result, result.value instanceof Promise)
  if(next.done === true) {
    return false;
  }

  const fr = f(value);
  if(fr === false) { 
    throw new Error(NOT_AUTHORIZED);
  }

  (fr instanceof Promise)
  ? fr.then((r) => {
    if(r === false) {
      throw new Error(NOT_AUTHORIZED);
    }
    run(f,iter)
  }) 
  : (run(f, iter))
}

// ===== 블럭킹 함수
const blocking = (
  rules: any, 
  root: any, 
  args: any,
  ctx: TContext,
  info: any, 
) => {
  const operationType = info.operation.operation;
  const selections = info.operation.selectionSet.selections;
  let iter = selections[Symbol.iterator]();

  run(
    (a) => {
      // console.log('> ', rules[operationType],a.name.value,  rules[operationType][a.name.value])
      if( rules[operationType] && rules[operationType][a.name.value] ) {
        return rules[operationType][a.name.value](root, args, ctx, info, a)
      }

    },
    iter
  )
}

const graphqlPermission = async (
  resolve: any, 
  root: any, 
  args: any,
  ctx: TContext,
  info: any
) => {
  // console.dir(info, { depth: 0 })
  // console.log('> graphqlPermission: ', root)
  if(root) {
    blocking(rules, root, args, ctx, info);
  }

  const result = await resolve(root, args, ctx, info);
  return result;
};



export default graphqlPermission
import { schema } from 'nexus';
import { ObjectDefinitionBlock  } from '../../../node_modules/@nexus/schema/dist/definitions/objectType'

const todoMutation = (t: ObjectDefinitionBlock<"Mutation">) => {
  // # 카테고리
  t.field('createCategory', {
    type: 'todo_category',
    deprecation: '카테고리 생성',
    authorize: (_, __, ctx: any) => {
      return !!(ctx.request.user && ctx.request.user.id)
    },
    resolve: () => {
      t.crud.createOnetodo_category();
      return {
        id:5,
        category: '당근'
      }
    }
  })
  t.crud.updateOnetodo_category();
  t.crud.deleteOnetodo_category();
  

  // # todo
  t.crud.createOnetodo();
  t.crud.updateOnetodo();
  t.crud.deleteOnetodo();

  // t.field("tt", {
  //   type: 'user',
  //   args: {
  //     user_id: schema.stringArg()
  //   },
  //   resolve: (...args): any => {
  //     console.log('> ', args);
  //     return {
  //       user_id: 'r'
  //     };
  //   }
  // })

};


export default todoMutation;

import { schema } from 'nexus';
import { ObjectDefinitionBlock  } from '../../../node_modules/@nexus/schema/dist/definitions/objectType'

const todoMutation = (t: ObjectDefinitionBlock<"Mutation">) => {
  // # 카테고리
  t.crud.createOnetodo_category();
  t.crud.updateOnetodo_category();

  // # todo
  t.crud.createOnetodo();
  t.crud.updateOnetodo();


  t.field("tt", {
    type: 'user',
    args: {
      user_id: schema.stringArg()
    },
    resolve: (...args): any => {
      console.log('> ', args);
      return {
        user_id: 'r'
      };
    }
  })

};


export default todoMutation;

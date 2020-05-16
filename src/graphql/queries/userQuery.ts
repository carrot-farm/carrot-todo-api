import { ObjectDefinitionBlock  } from '../../../node_modules/@nexus/schema/dist/definitions/objectType'

export default (t: ObjectDefinitionBlock<"Query">) => {
  t.string('test', {
    resolve: (...args) => {
      // console.log('> ', args)
      return '당근'
    }
  });

  t.crud.user();
}
import { ObjectDefinitionBlock  } from '../../../node_modules/@nexus/schema/dist/definitions/objectType'


export default (t: ObjectDefinitionBlock<"Query">) => {

  t.string('test', {
    resolve: (...args) => {
      // console.log('> ', args)
      return '당근'
    }
  });
  
  // t.crud.todoCategories({
  //   ordering: true,
  //   filtering: true,
  //   pagination: true
  // });
  // t.crud.todoCategory();

  // t.crud.todo();
  // t.crud.todos({
  //   ordering: true,
  //   filtering: true,
  //   pagination: true
  // });
  
}
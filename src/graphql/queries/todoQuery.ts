import { ObjectDefinitionBlock  } from '../../../node_modules/@nexus/schema/dist/definitions/objectType'

export default (t: ObjectDefinitionBlock<"Query">) => {

  t.crud.todoCategories({
    pagination: true
  });
  t.crud.todoCategory();

  t.crud.todo();
  t.crud.todos({
    ordering: true,
    filtering: true,
    pagination: true
  });
  
}
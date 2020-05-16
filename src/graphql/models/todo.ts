import { schema } from 'nexus';


const todo = schema.objectType({
  name: 'todo',
  definition(t) {
    t.model.id();
    t.model.todo();
    t.model.is_completed();
    t.model.todo_category()
  }
});

export default todo;
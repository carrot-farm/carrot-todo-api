import { schema } from 'nexus';

// ===== 사용자 모델
const todo_category = schema.objectType({
  name: 'todo_category',
  definition(t) {
    t.model.category();
    t.model.id();
    t.model.user_pk();
  }
});

export default todo_category;
import { schema } from 'nexus';

// ===== 사용자 모델
const user = schema.objectType({
  name: 'user',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.is_block();
    t.model.is_withdraw();
    t.model.is_verify();
    t.model.password();
    t.model.password_salt();
    t.model.user_id();
  }
});

export default user;
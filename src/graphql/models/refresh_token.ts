import { schema } from 'nexus';

const refresh_token = schema.objectType({
  name: 'refresh_token',
  definition(t) {
    t.model.id();
    t.model.expires_time();
    t.model.refresh_token();
    t.model.user_pk();
  }
});

export default refresh_token;
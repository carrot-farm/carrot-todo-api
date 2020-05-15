import { schema } from 'nexus';


const login_log = schema.objectType({
  name: 'login_log',
  definition(t) {
    t.model.id();
    t.model.login_ip();
    t.model.login_time();
  }
});

export default login_log;
import { schema } from 'nexus';
import userQuery from './queries/userQuery';
import todoQuery from './queries/todoQuery';

// ===== 쿼리
const Query = schema.queryType({
  definition(t) {
    // ===== 테스트
    t.string('info', { 
      resolve: () => 'hello',
      description: '테스트' 
    })

    userQuery(t);

    todoQuery(t);


    // ===== 유저 정보
    // t.list.field('users', {
    //   type: 'user',
    //   resolve: async (parent, args, ctx) => {
    //     await ctx.prisma.user.findMany()
    //     return true;
    //   }
    // });
    t.crud.users({
      pagination: true
    });

  }
})

export default Query;
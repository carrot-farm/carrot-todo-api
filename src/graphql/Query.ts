import { schema } from 'nexus';
import { resolve } from 'dns';

// ===== 쿼리
const Query = schema.queryType({
  definition(t) {
    // ===== 테스트
    t.string('info', { 
      resolve: () => 'hello',
      description: '테스트' 
    })


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

  },
})

export default Query;
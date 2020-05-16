import { schema } from 'nexus';
import categoryMutation from './mutations/categoryMutation'


const Mutation = schema.mutationType({
  definition(t) {
    // ===== 유저 등록
    // t.crud.createOneuser();

    categoryMutation(t)

    // ===== 유저 등록
    // t.field('signup', {
    //   type: 'user',
    //   args: {
    //     email: schema.stringArg({ required: true}),
    //   },
    //   resolve: async (parent, { email }, ctx) => {
    //     const user = await ctx.prisma.user.create({
    //       data: {
    //         email,
    //         is_block: 0,
    //         is_withdraw: 0,
    //         user_id: `${email}+15`,
    //         password: 'password',
    //         password_salt: email,
    //       }
    //     });
    //     console.log('> ', user)
    //     return user;
    //   }
    // })

    t.crud.createOneuser();
    
    // t.field('user', {
    //   type: 'user',
    //   args: {
    //     name: schema.stringArg()
    //   },
    //   resolve: async (parent, { name }, ctx) => {
    //     const user = await ctx.prisma.user.create({
    //       data: {
    //         name
    //       }
    //     });
    //     return user;
    //   }
    // })
  }
});

export default Mutation;
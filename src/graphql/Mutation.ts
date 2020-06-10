import { schema } from 'nexus';
import categoryMutation from './mutations/categoryMutation';
import { connectUser } from '../utils/crudUtil';
import { NOT_AUTHORIZED } from '../const';


const Mutation = schema.mutationType({
  definition(t) {
    // ===== 유저 등록
    // t.crud.createOneuser();

    // categoryMutation(t)

    // # 카테고리 생성
    t.crud.createOnetodo_category({
      computedInputs: {
        user: connectUser,
      }
    });

    // # 카테고리 업데이트
    t.crud.updateOnetodo_category({
      computedInputs: {
        user: connectUser
      }
    });

    // # 카테고리 삭제
    t.field('deleteCategory', {
      type: 'todo_category',
      description: '카테고리 삭제',
      args: {
        id: schema.idArg({ required: true })
      },
      authorize: (_:any, args:any, ctx:any) =>
        !!ctx.request.user,
      resolve: async (_:any, args:any, ctx:TContext) => {
        const id = Number(args.id);
        // console.log('> check params: ', id, ctx.request.user)
        const res = await ctx.request.prisma.todo_category.delete({
          where: {
            id,
            user_pk: ctx.request.user!.id
          }
        });
        // console.log('> delete done:', res)
        return res;
      }
    })

    t.crud.createOnetodo();
    t.crud.updateOnetodo();
    t.crud.deleteOnetodo();

    t.boolean('mInvalidToken', {
      args: {
        t: schema.intArg()
      },
      authorize: () => false,
      resolve: () => {
        return true;
      }
    });

    

    // t.field('createCategoryOne', {
    //   description: '카테고리 생성',
    //   type: 'todo_category',
    //   args: {
    //     id: schema.idArg(),
    //     category: schema.stringArg()
    //   },
    //   // authorize: (_, __, ctx: any) => {
    //   //   return !!(ctx.request.user && ctx.request.user.id)
    //   // },
    //   resolve: async (_, args, ctx) => {
    //     console.log('> ', args)
    //     const result = await ctx.prisma.todo_category.create({
    //       data: {
    //         category: args.category!,
    //         user: {
    //           connect: {
    //             id: 23
    //           }
    //         }
    //       }
    //     })
    //     t.crud.createOnetodo_category({
    //       computedInputs:
    //     });
    //     return {
    //       id:5,
    //       category: '당근'
    //     }
    //   }
    // })
    
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

    // t.crud.createOneuser();
    
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
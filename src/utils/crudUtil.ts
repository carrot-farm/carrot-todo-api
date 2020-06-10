import { schema } from 'nexus';
import { NOT_AUTHORIZED } from '../const';

import { TContextCreator } from '../types/context';
import { GetGen } from "../../node_modules/@nexus/schema/dist/typegenTypeHelpers";
import { AllNexusOutputTypeDefs } from "../../node_modules/@nexus/schema/dist/definitions/wrapping";
import { ArgsRecord } from "../../node_modules/@nexus/schema/dist/definitions/args";
import { FieldAuthorizeResolver } from "@nexus/schema/dist/plugins/fieldAuthorizePlugin"
// import { prisma } from '../context';
import { ModelTypes } from '../../node_modules/@types/nexus-prisma-typegen';

// ===== `t.crud` 에서 유저 정보 연결시 사용.
type TConnectUser = {
  /** 컨텐스트 객체 */
  ctx: TContextCreator
}
/** `t.crud` 에서 유저 정보 연결시 사용. */
export const connectUser = ({ ctx }: TConnectUser) => {
  console.log('> connectUser', ctx.request.user)
  if(!ctx.request.user) {
    throw new Error(NOT_AUTHORIZED);
  }
  return ({
    connect: {
      id: ctx.request.user.id
    }
  })
};

// ===== pagenation
type TPagenationParams<ModelType> = {
  /** 타입 */
  type?: GetGen<"allOutputTypes", string> | AllNexusOutputTypeDefs;
  /** prisma model type */
  prismaModel: ModelType;
  /** 설명 */
  description?: string | null;
  /** arguments  */
  args?: ArgsRecord;
  /** false 반환 시 `Not authorize` */
  authorize?: FieldAuthorizeResolver<string, string>
  /** where 절 */
  where?: any;
  /** order by */
  orderBy?: any;
};
/** 페이지 네이션 */
export const pagenation = <ModelType extends any>({
  type,
  prismaModel,
  description,
  args,
  authorize,
  where,
  orderBy,
}: TPagenationParams<ModelType>): any => {
  const options = {
    type: type || prismaModel,
    description,
    args: {
      page: schema.intArg({
        required: true,
        description: "페이지 번호",
      }),
      take: schema.intArg({
        description: "가져올 레코드의 수",
        default: 10,
      }),
      ...args,
    },
    authorize: authorize || ((_, args, ctx) => !!ctx.request.user),
    resolve: async (_: any, args: any, ctx: TContextCreator) => {
      const user = ctx.request.user!;
      const prisma = ctx.request.prisma;
      const data = await prisma[prismaModel].findMany({
      // const data = await prisma['login_log'].findMany({
        where: {
          user_pk: user.id,
          ...where,
        },
        skip: (args.page - 1) * 5,
        take: args.take,
        orderBy: {
          id: "desc",
          ...orderBy,
        },
      });
      // console.log(`> data: `, data)
      return data;
    },
  };

  return options;
};

// ===== 카운트
type TPrismaCount<PrismaModel> = {
  prismaModel: PrismaModel,
  where?: any
};
/** prisma count */
export const prismaCount = <PrismaModel extends any>({
  prismaModel,
  where
}:TPrismaCount<PrismaModel> ) => {
  const options = {
    resolve: async (_: any, __: any, ctx: TContext) => {
      const user = ctx.request.user!;
      const prisma = ctx.request.prisma;
      const data = await prisma[prismaModel].count({
        where: {
          user_pk: user.id,
          ...where
        },
      });
      return data
    }
  }
  return options;
}
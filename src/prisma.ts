import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// FIXME: {log: [ "query" ]} 옵션을 사용하여 쿼리 로그를 출력 => 필요없는 경우 {log: []}
// FIXME: $extends 메서드를 사용하여 모델에 커스텀 메세지 추가
// https://www.prisma.io/docs/orm/prisma-client/client-extensions/model
const database = new PrismaClient({ log: [ "info", "query" ] })
//   .$extends({
//   name: "custom-extended-methods",
//   model: {
//     // FIXME: 커스텀 메서드는 트랜젝션에서는 동작하지 않는 다는 포스팅이 있음 테스트 필요
//     $allModels: {
//       // exists 메서드 추가
//       async exists<T>(
//         this: T,
//         where: Prisma.Args<T, "findFirst">["where"]
//       ): Promise<boolean> {
//         const context = Prisma.getExtensionContext(this);
//         const result = await (context as any).findFirst({ where: where });
//         return result !== null;
//       },
//       async softDelete<T>(
//         this: T,
//         where: Prisma.Args<T, "updateMany">["where"]
//       ): Promise<void> {
//         const context = Prisma.getExtensionContext(this);
//         await (context as any).updateMany({ where: where, data: { deletedAt: new Date() } });
//       },
//       async getActive<T>(
//         this: T,
//         where: Prisma.Args<T, "findFirst">["where"]
//       ): Promise<void> {
//         const context = Prisma.getExtensionContext(this);
//         // FIXME: deletedAt 이 null 인 경우만 조회하도록 수정
//         // FIXME: 근데 상황, 조건이 여러개가 있을 수 있어서 일단 PASS
//         return await (context as any).findFirst({ where: where });
//       },
//       async listActive<T>(
//         this: T,
//         where: Prisma.Args<T, "findMany">["where"]
//       ): Promise<void> {
//         const context = Prisma.getExtensionContext(this);
//         // FIXME: deletedAt 이 null 인 경우만 조회하도록 수정
//         // FIXME: 근데 상황, 조건이 여러개가 있을 수 있어서 일단 PASS
//         return await (context as any).findMany({ where: where });
//       }
//     }
//   }
// });

export const prisma = globalForPrisma.prisma || database;

// FIXME: 이거 왜 있는거임?
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

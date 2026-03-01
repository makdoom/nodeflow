import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.auth.user.id);
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;

import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),

  // Create workflow
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "makdoom@gmail.com",
      },
    });
    return prisma.workflow.create({
      data: {
        name: "New Workflow",
      },
    });
  }),
});

export type AppRouter = typeof appRouter;

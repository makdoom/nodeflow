import { PAGINATION } from "@/config/constant";
import { CredentialType } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premimumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const credentialsRouter = createTRPCRouter({
  create: premimumProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, value, type } = input;
      return prisma.credential.create({
        data: {
          name,
          type,
          value,
          userId: ctx.auth.user.id,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.credential.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, type, value } = input;
      const credential = await prisma.credential.findUniqueOrThrow({
        where: {
          id: id,
          userId: ctx.auth.user.id,
        },
      });

      return prisma.credential.update({
        where: { id: credential.id },
        data: { name, type, value, updatedAt: new Date() },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().optional().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    }),

  getByType: protectedProcedure
    .input(z.object({ type: z.enum(CredentialType) }))
    .query(async ({ ctx, input }) => {
      return prisma.credential.findMany({
        where: {
          type: input.type,
          userId: ctx.auth.user.id,
        },

        orderBy: { updatedAt: "desc" },
      });
    }),
});

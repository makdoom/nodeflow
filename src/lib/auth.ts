import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "580b1a22-cc8e-43a3-aa0b-86c1d243847c",
              slug: "Nodeflow-Pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodeflow-Pro
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || "http://localhost:3000",
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});

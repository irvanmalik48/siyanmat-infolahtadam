import { initTRPC, TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

import { IContext } from "./context";
import { loginSchema as signUpSchema } from "../common/validation/auth";

const t = initTRPC.context<IContext>().create();

export const serverRouter = t.router({
  signup: t.procedure.input(signUpSchema).mutation(async ({ input, ctx }) => {
    const { email, name, password } = input;

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists.",
      });
    }

    const hashedPassword = await hash(password, 10);

    const result = await ctx.prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return {
      status: 201,
      message: "Account created successfully",
      result: result.email,
    };

  }),
});

export type IServerRouter = typeof serverRouter;
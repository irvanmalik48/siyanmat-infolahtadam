import { initTRPC, TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

import { IContext } from "./context";
import { loginSchema as signUpSchema } from "../common/validation/auth";
import { idSchema, kegiatanSchema, menitPemakaianSchema, peralatanSchema } from "@/types/types";

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
  tambahKegiatan: t.procedure.input(kegiatanSchema).mutation(async ({ input, ctx }) => {
    const { namaKegiatan, tglKegiatan, idPeralatan, waktuGuna, keterangan, operator } = input;

    const result = await ctx.prisma.kegiatan.create({
      // @ts-ignore
      data: { namaKegiatan, tglKegiatan, idPeralatan, waktuGuna, keterangan, operator },
    });

    return {
      status: 201,
      message: "Kegiatan created successfully",
      result: result.namaKegiatan,
    };
  }),
  editKegiatan: t.procedure.input(kegiatanSchema).mutation(async ({ input, ctx }) => {
    const { id, namaKegiatan, tglKegiatan, idPeralatan, waktuGuna, keterangan, operator } = input;

    const result = await ctx.prisma.kegiatan.update({
      where: { id },
      // @ts-ignore
      data: { namaKegiatan, tglKegiatan, idPeralatan, waktuGuna, keterangan, operator },
    });

    return {
      status: 201,
      message: "Kegiatan updated successfully",
      result: result.namaKegiatan,
    };
  }),
  getAllKegiatan: t.procedure.mutation(async ({ ctx }) => {
    const result = await ctx.prisma.kegiatan.findMany();

    return {
      status: 201,
      message: "Kegiatan fetched successfully",
      result: result,
    };
  }),
  getKegiatanById: t.procedure.input(idSchema).mutation(async ({ input, ctx }) => {
    const { id } = input;

    const result = await ctx.prisma.kegiatan.findUnique({
      where: { id },
    });

    return {
      status: 201,
      message: `Kegiatan ${id} fetched successfully`,
      result: result,
    };
  }),
  deleteKegiatan: t.procedure.input(idSchema).mutation(async ({ input, ctx }) => {
    const { id } = input;

    const result = await ctx.prisma.kegiatan.delete({
      where: { id },
    });

    return {
      status: 201,
      message: `Kegiatan ${id} deleted successfully`,
      result: result,
    };
  }),
  tambahPeralatan: t.procedure.input(peralatanSchema).mutation(async ({ input, ctx }) => {
    const { namaPeralatan, tglPengadaan, maksUsia, gambar } = input;



    const result = await ctx.prisma.peralatan.create({
      data: { namaPeralatan, tglPengadaan, maksUsia, gambar },
    });

    return {
      status: 201,
      message: "Peralatan created successfully",
      result: result.namaPeralatan,
    };
  }),
  getAllPeralatan: t.procedure.mutation(async ({ ctx }) => {
    const result = await ctx.prisma.peralatan.findMany();

    return {
      status: 201,
      message: "Peralatan fetched successfully",
      result: result,
    };
  }),
  getPeralatanById: t.procedure.input(idSchema).mutation(async ({ input, ctx }) => {
    const { id } = input;

    const result = await ctx.prisma.peralatan.findUnique({
      where: { id },
    });

    return {
      status: 201,
      message: `Peralatan ${id} fetched successfully`,
      result: result,
    };
  }),

  tambahMenitPemakaian: t.procedure.input(menitPemakaianSchema).mutation(async ({ input, ctx }) => {
    const { id, menitPemakaian } = input;

    const result = await ctx.prisma.peralatan.update({
      where: { id },
      data: { menitPemakaian },
    });

    return {
      status: 201,
      message: `Peralatan ${id} updated successfully`,
      result: result,
    };
  }),
});

export type IServerRouter = typeof serverRouter;
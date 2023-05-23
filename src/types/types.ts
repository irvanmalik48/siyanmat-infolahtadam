import { Kegiatan, User } from "@prisma/client";
import { z } from "zod";

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  children: any;
}

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

export const kegiatanSchema = z.object({
  id: z.string(),
  namaKegiatan: z.string(),
  tglKegiatan: z.date().or(z.string()),
  idPeralatan: z.string(),
  waktuGuna: z.number().or(z.string()),
  keterangan: z.string(),
  operator: z.string(),
});

export const peralatanSchema = z.object({
  id: z.string(),
  namaPeralatan: z.string(),
  tglPengadaan: z.date(),
  menitPemakaian: z.number().default(0),
  maksUsia: z.number(),
  gambar: z.string().optional(),
});

export const menitPemakaianSchema = z.object({
  id: z.string(),
  menitPemakaian: z.number(),
});

export const activityLogSchema = z.object({
  id: z.string(),
  idKegiatan: z.string().optional(),
  idPeralatan: z.string().optional(),
  idUser: z.string(),
  description: z.string(),
});

export const idSchema = z.object({
  id: z.string(),
});

export type IUser = z.infer<typeof userSchema>;
export type IKegiatan = z.infer<typeof kegiatanSchema>;
export type IPeralatan = z.infer<typeof peralatanSchema>;
export type IActivityLog = z.infer<typeof activityLogSchema>;

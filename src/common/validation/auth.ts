import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string(),
});

export type ILogin = z.infer<typeof loginSchema>;

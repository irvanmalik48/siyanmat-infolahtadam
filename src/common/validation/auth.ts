import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof loginSchema>;
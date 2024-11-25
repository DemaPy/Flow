import { z } from "zod";

export const credentialShema = z.object({
  name: z.string().max(30),
  value: z.string().max(500),
});

export type credentialShemaType = z.infer<typeof credentialShema>;

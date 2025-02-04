import { z } from "zod";

export const workflowSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(80).optional(),
});

export type workflowShemaType = z.infer<typeof workflowSchema>;

export const workflowSchemaDuplicate = workflowSchema.extend({
  workflowId: z.string(),
});

export type workflowDuplicateShemaType = z.infer<
  typeof workflowSchemaDuplicate
>;

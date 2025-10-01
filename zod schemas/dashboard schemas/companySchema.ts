import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name should not exceed 100 characters" }),

  coverImage: z.instanceof(File).optional(),
  image: z.instanceof(File).optional(),
  location: z
    .string()
    .min(1, { message: "Location is required" })
    .max(100, { message: "Location should not exceed 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description should not exceed 500 characters" })
    .min(1, { message: "Description is required" }),
});

export type CreateCompanyValue = z.infer<typeof createCompanySchema>;

import { email, z } from "zod";

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(30, { message: "Username should not exceed 30 characters" }),
  password: z
    .string()
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const registerFormSchema = z
  .object({
    email: z
      .email()
      .min(1, { message: "Email is required" })
      .max(50, { message: "Email should not exceed 50 characters" }),
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(30, { message: "Username should not exceed 30 characters" }),

    password: z
      .string()
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .superRefine((inputs, ctx) => {
    if (inputs.password !== inputs.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValue = z.infer<typeof registerFormSchema>;

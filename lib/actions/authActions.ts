"use server";

import {
  registerFormSchema,
  RegisterFormValue,
} from "@/zod schemas/authSchemas/authSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@/prisma/prisma";
import { hash } from "bcryptjs";

const passwordSalt = 12;

export async function registerUserAction(values: RegisterFormValue) {
  const session = await getServerSession(authOptions);
  if (session) {
    return { success: false, error: "You are already logged in." };
  }

  const validationResult = registerFormSchema.safeParse(values);

  if (!validationResult.success) {
    return { success: false, error: "Invalid inputs" };
  }

  const { email, password, username } = validationResult.data;
  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return {
        success: false,
        error: "A user with this username or email is already existed",
      };
    }

    const hashedPassword = await hash(password, passwordSalt);

    const newUser = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    return {
      success: true,
      message: "Created new user successfully",
      data: { username, password },
    };
  } catch (err) {
    console.error(err, "Unexpected error occured");

    return { success: false, error: "Unexpected Error occured" };
  }
}

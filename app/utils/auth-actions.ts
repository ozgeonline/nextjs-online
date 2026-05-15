"use server";

import prisma from "./db";
import { hashPassword } from "./password";
import { getPassword, isValidEmail, isValidPassword, normalizeEmail } from "./auth-validation";

type SignUpState = {
  error?: string
  success?: boolean
}

export async function signUpWithCredentials(formData: FormData): Promise<SignUpState> {
  const email = normalizeEmail(formData.get("email"));
  const password = getPassword(formData.get("password"));

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return { error: "Enter a valid email and a password with at least 8 characters." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "Unable to create an account with these details. This email address is already registered." };
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  return { success: true };
}

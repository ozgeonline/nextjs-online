"use server";

import prisma from "./db";
import { hashPassword } from "./password";
import { getPassword, isValidEmail, isValidPassword, normalizeEmail } from "./auth-validation";

type SignUpState = {
  error?: "INVALID_DETAILS" | "DUPLICATE_EMAIL"
  success?: boolean
}

export async function signUpWithCredentials(formData: FormData): Promise<SignUpState> {
  const email = normalizeEmail(formData.get("email"));
  const password = getPassword(formData.get("password"));

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return { error: "INVALID_DETAILS" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "DUPLICATE_EMAIL" };
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

"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Everything in this file runs on the server only. The "use server" directive
// at the top turns each exported async function into a Server Action: React
// gives the browser a reference to it, and calling it fires a POST request
// behind the scenes. The Prisma import below never reaches the browser bundle.

export type FormState = { error?: string };

export async function createUser(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  // Server Actions are reachable by any POST request, not just your form, so
  // never trust the input — validate it here rather than only in the browser.
  if (!name || !email) {
    return { error: "Name and email are both required." };
  }

  try {
    await prisma.user.create({ data: { name, email } });
  } catch (error) {
    // P2002 is Prisma's code for a unique constraint violation — here, the
    // @unique on User.email that the database itself enforces.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: `"${email}" is already registered.` };
    }
    throw error;
  }

  // The page cached the previous list of users. Without this, the new row is in
  // the database but the UI keeps showing the stale render.
  revalidatePath("/");
  return {};
}

export async function deleteUser(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.user.delete({ where: { id } });
  revalidatePath("/");
}

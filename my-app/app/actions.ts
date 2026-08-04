"use server";

import {prisma} from "@/lib/prisma";

export async function createNote(formdata: FormData) {
  const body = String(formdata.get("body") ?? "").trim();

  if (!body) return;
  
  await prisma.note.create({
    data: {
      body,
    },
  });
}
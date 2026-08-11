"use server";

import {prisma} from "@/lib/prisma";


export async function updateNote(id: number, formdata: FormData) {
  const body = String(formdata.get("body") ?? "").trim();
  const title = String(formdata.get("title") ?? "").trim();
  const description = String(formdata.get("description") ?? "").trim();
  const dueDate = new Date(String(formdata.get("dueDate")));
  const topic = String(formdata.get("topic") ?? "").trim();

  if (!body) return;

  await prisma.note.update({
    where: { id },
    data: { body },
  });
}

export async function createNote(formdata: FormData) {
  const body = String(formdata.get("body") ?? "").trim();
  const title = String(formdata.get("title") ?? "").trim();
  const description = String(formdata.get("description") ?? "").trim();
  const dueDate = new Date(String(formdata.get("dueDate")));
  const topic = String(formdata.get("topic") ?? "").trim();


  if (!body) return;
  
  await prisma.note.create({
    data: {
      body,
    },
  });
}
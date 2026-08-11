"use server";

import {prisma} from "@/lib/prisma";


export async function updateNote(id: number, formdata: FormData) {
  const body = String(formdata.get("body") ?? "").trim();
  const title = String(formdata.get("title") ?? "").trim();
  const description = String(formdata.get("description") ?? "").trim();
  const dueDate = new Date(String(formdata.get("dueDate")));
  const topic = String(formdata.get("topic") ?? "").trim();

  if (!body) return;

  await prisma.task.update({
    where: { id },
    data: { body, title, description, dueDate, topic },
  });
}

export async function createNote(formdata: FormData) {
  const body = String(formdata.get("body") ?? "").trim();
  const title = String(formdata.get("title") ?? "").trim();
  const description = String(formdata.get("description") ?? "").trim();
  const dueDate = new Date(String(formdata.get("dueDate")));
  const topic = String(formdata.get("topic") ?? "").trim();

  if (!body) return;

  await prisma.task.create({
    data: { body, title, description, dueDate, topic },
  });
}


export async function archiveTask(id: number) {
  await prisma.task.update({
    where: { id },
    data: { archived: true },
  });
}

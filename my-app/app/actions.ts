"use server";

import {prisma} from "@/lib/prisma";
import { Status } from "@prisma/client";


export async function updateNote(id: number, formdata: FormData) {
  const body = String(formdata.get("body") ?? "").trim();
  const title = String(formdata.get("title") ?? "").trim();
  const description = String(formdata.get("description") ?? "").trim();
  const dueDate = new Date(String(formdata.get("dueDate")));
  const topic = String(formdata.get("topic") ?? "").trim();
  const status = String(formdata.get("status") ?? "Todo") as Status;

  if (!body) return;

  await prisma.task.update({
    where: { id },
    data: { body, title, description, dueDate, topic, status },
  });
}

export async function createNote(formdata: FormData) {
  const body = String(formdata.get("body") ?? "").trim();
  const title = String(formdata.get("title") ?? "").trim();
  const description = String(formdata.get("description") ?? "").trim();
  const dueDate = new Date(String(formdata.get("dueDate")));
  const topic = String(formdata.get("topic") ?? "").trim();
  const status = String(formdata.get("status") ?? "Todo") as Status;

  if (!body) return;

  await prisma.task.create({
    data: { body, title, description, dueDate, topic, status },
  });
}


export async function archiveTask(id: number) {
  await prisma.task.update({
    where: { id },
    data: { archived: true },
  });
}

import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import { archiveTask, createNote, updateNote } from "../app/actions";

function makeFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("createNote", () => {
  it("saves a new task with all its fields", async () => {
    await createNote(
      makeFormData({
        title: "Buy milk",
        body: "note body",
        description: "2% milk, the big carton",
        dueDate: "2026-09-01",
        topic: "Groceries",
        status: "Todo",
      })
    );

    const tasks = await prisma.task.findMany();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      title: "Buy milk",
      description: "2% milk, the big carton",
      topic: "Groceries",
      status: "Todo",
      archived: false,
    });
  });
});

describe("updateNote", () => {
  it("changes an existing task's fields", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Old title",
        body: "old body",
        description: "old description",
        dueDate: new Date("2026-01-01"),
        topic: "Old topic",
        status: "Todo",
      },
    });

    await updateNote(
      task.id,
      makeFormData({
        title: "New title",
        body: "new body",
        description: "new description",
        dueDate: "2026-02-01",
        topic: "New topic",
        status: "InProgress",
      })
    );

    const updated = await prisma.task.findUniqueOrThrow({ where: { id: task.id } });
    expect(updated.title).toBe("New title");
    expect(updated.status).toBe("InProgress");
  });
});

describe("archiveTask", () => {
  it("marks a task archived instead of deleting it, hiding it from the active list", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Throwaway",
        body: "body",
        description: "description",
        dueDate: new Date("2026-01-01"),
        topic: "Topic",
      },
    });

    await archiveTask(task.id);

    const archived = await prisma.task.findUniqueOrThrow({ where: { id: task.id } });
    expect(archived.archived).toBe(true);

    const visibleTasks = await prisma.task.findMany({ where: { archived: false } });
    expect(visibleTasks).toHaveLength(0);
  });
});

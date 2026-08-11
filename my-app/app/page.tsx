import { archiveTask, createNote } from "./actions";
import { prisma } from "@/lib/prisma";
import { updateNote } from "./actions";
import Link from "next/link";

const inputClass =
  "w-full border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 bg-white dark:bg-neutral-900";
const labelClass = "block text-sm font-medium mt-3 mb-1";
const primaryButtonClass =
  "mt-3 px-4 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;

  const orderBy =
    sort === "topic" ? { topic: "asc" as const } :
    sort === "status" ? { status: "asc" as const } :
    sort === "dueDate" ? { dueDate: "asc" as const } :
    { createdAt: "desc" as const };

  const notes = await prisma.task.findMany({
    where: { archived: false },
    orderBy,
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      <nav className="flex flex-wrap gap-2 mb-6 text-sm">
        <span className="text-gray-500">Sort by:</span>
        <Link href="?sort=topic" className="text-blue-600 hover:underline">Topic</Link>
        <Link href="?sort=status" className="text-blue-600 hover:underline">Status</Link>
        <Link href="?sort=dueDate" className="text-blue-600 hover:underline">Due Date</Link>
        <Link href="?" className="text-blue-600 hover:underline">Newest</Link>
      </nav>

      <details className="mb-6 border border-gray-300 dark:border-neutral-700 rounded-lg p-4">
        <summary className="cursor-pointer font-medium">+ New Note</summary>
        <form action={createNote} className="mt-2">
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" name="title" type="text" className={inputClass} />

          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" name="description" rows={4} className={inputClass} />

          <label htmlFor="dueDate" className={labelClass}>Due Date</label>
          <input id="dueDate" name="dueDate" type="date" className={inputClass} />

          <label htmlFor="topic" className={labelClass}>Topic</label>
          <input id="topic" name="topic" type="text" className={inputClass} />

          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" name="status" defaultValue="Todo" className={inputClass}>
            <option value="Todo">Todo</option>
            <option value="InProgress">In-Progress</option>
            <option value="Complete">Complete</option>
          </select>

          <label htmlFor="body" className={labelClass}>Note</label>
          <textarea id="body" name="body" rows={8} className={inputClass} />

          <button type="submit" className={primaryButtonClass}>Save</button>
        </form>
      </details>

      <ul className="flex flex-col gap-4">
        {notes.map((note) => {
          const isOverdue = note.dueDate < new Date() && note.status !== "Complete";

          return (
            <li
              key={note.id}
              className="border border-gray-300 dark:border-neutral-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{note.title || note.body}</h2>
                  <p className="text-sm text-gray-500">
                    {note.topic} · {note.status}
                  </p>
                </div>
                <form action={archiveTask.bind(null, note.id)}>
                  <button
                    type="submit"
                    className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    Archive
                  </button>
                </form>
              </div>

              <p
                className={
                  isOverdue
                    ? "mt-2 text-sm text-red-600 font-bold"
                    : "mt-2 text-sm text-gray-500"
                }
              >
                Due: {note.dueDate.toLocaleDateString()}
                {isOverdue && " — overdue"}
              </p>

              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
                  Edit
                </summary>

                <p className="mt-2 text-sm">{note.description}</p>

                <form action={updateNote.bind(null, note.id)} className="mt-2">
                  <label htmlFor={`title-${note.id}`} className={labelClass}>Title</label>
                  <input
                    id={`title-${note.id}`}
                    name="title"
                    type="text"
                    defaultValue={note.title}
                    className={inputClass}
                  />

                  <label htmlFor={`description-${note.id}`} className={labelClass}>Description</label>
                  <textarea
                    id={`description-${note.id}`}
                    name="description"
                    rows={4}
                    defaultValue={note.description}
                    className={inputClass}
                  />

                  <label htmlFor={`dueDate-${note.id}`} className={labelClass}>Due Date</label>
                  <input
                    id={`dueDate-${note.id}`}
                    name="dueDate"
                    type="date"
                    defaultValue={note.dueDate.toISOString().slice(0, 10)}
                    className={inputClass}
                  />

                  <label htmlFor={`topic-${note.id}`} className={labelClass}>Topic</label>
                  <input
                    id={`topic-${note.id}`}
                    name="topic"
                    type="text"
                    defaultValue={note.topic}
                    className={inputClass}
                  />

                  <label htmlFor={`status-${note.id}`} className={labelClass}>Status</label>
                  <select
                    id={`status-${note.id}`}
                    name="status"
                    defaultValue={note.status}
                    className={inputClass}
                  >
                    <option value="Todo">Todo</option>
                    <option value="InProgress">In-Progress</option>
                    <option value="Complete">Complete</option>
                  </select>

                  <label htmlFor={`body-${note.id}`} className={labelClass}>Note</label>
                  <textarea
                    id={`body-${note.id}`}
                    name="body"
                    rows={8}
                    defaultValue={note.body}
                    className={inputClass}
                  />

                  <button type="submit" className={primaryButtonClass}>Save</button>
                </form>
              </details>

              <time
                dateTime={note.createdAt.toISOString()}
                className="block mt-3 text-xs text-gray-400"
              >
                {note.createdAt.toLocaleString()}
              </time>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

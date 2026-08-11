import { archiveTask, createNote } from "./actions";
import { prisma } from "@/lib/prisma";
import { updateNote } from "./actions";
import Link from "next/link";

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
    <main>
      <h1>Notes</h1>

      <nav>
        Sort by: <Link href="?sort=topic">Topic</Link> |{" "}
        <Link href="?sort=status">Status</Link> |{" "}
        <Link href="?sort=dueDate">Due Date</Link> |{" "}
        <Link href="?">Newest</Link>
      </nav>

      <details>
        <summary>New Note</summary>
      <form action={createNote}>

        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} />

        <label htmlFor="dueDate">Due Date</label>
        <input id="dueDate" name="dueDate" type="date" />

        <label htmlFor="topic">Topic</label>
        <input id="topic" name="topic" type="text" />

        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue="Todo">
          <option value="Todo">Todo</option>
          <option value="InProgress">In-Progress</option>
          <option value="Complete">Complete</option>
        </select>

        <label htmlFor="body">Note</label>
        <textarea id="body" name="body" rows={8} />
        <button type="submit">save</button>
      </form>
      </details>

      <ul>
        {notes.map((note) => {
          const isOverdue = note.dueDate < new Date() && note.status !== "Complete";

          return (
          <li key={note.id}>
            <details>
              <summary>{note.title || note.body}</summary>

              <p>{note.description}</p>
              <p>Topic: {note.topic}</p>
              <p>Status: {note.status}</p>
              <p className={isOverdue ? "text-red-600 font-bold" : undefined}>
                Due: {note.dueDate.toLocaleDateString()}
                {isOverdue && " — overdue"}
              </p>

              <form action={updateNote.bind(null, note.id)}>
                <label htmlFor={`title-${note.id}`}>Title</label>
                <input id={`title-${note.id}`} name="title" type="text" defaultValue={note.title} />

                <label htmlFor={`description-${note.id}`}>Description</label>
                <textarea id={`description-${note.id}`} name="description" rows={4} defaultValue={note.description} />

                <label htmlFor={`dueDate-${note.id}`}>Due Date</label>
                <input
                  id={`dueDate-${note.id}`}
                  name="dueDate"
                  type="date"
                  defaultValue={note.dueDate.toISOString().slice(0, 10)}
                />

                <label htmlFor={`topic-${note.id}`}>Topic</label>
                <input id={`topic-${note.id}`} name="topic" type="text" defaultValue={note.topic} />

                <label htmlFor={`status-${note.id}`}>Status</label>
                <select id={`status-${note.id}`} name="status" defaultValue={note.status}>
                  <option value="Todo">Todo</option>
                  <option value="InProgress">In-Progress</option>
                  <option value="Complete">Complete</option>
                </select>

                <label htmlFor={`body-${note.id}`}>Note</label>
                <textarea id={`body-${note.id}`} name="body" rows={8} defaultValue={note.body} />
                <button type="submit">save</button>
              </form>
              <form action={archiveTask.bind(null, note.id)}>
  <button type="submit">archive</button>
</form>
            </details>
            <time dateTime={note.createdAt.toISOString()}>
              {note.createdAt.toLocaleString()}
            </time>
          </li>
          );
        })}
      </ul>
    </main>
  );

}
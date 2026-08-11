import { createNote } from "./actions";
import { prisma } from "@/lib/prisma";
import { updateNote } from "./actions";

export default async function Home() {

  const notes = await prisma.task.findMany({
    where: { archived: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1>Notes</h1>

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

        <label htmlFor="body">Note</label>
        <textarea id="body" name="body" rows={8} />
        <button type="submit">save</button>
      </form>
      </details>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <details>
              <summary>{note.title || note.body}</summary>

              <p>{note.description}</p>
              <p>Topic: {note.topic}</p>
              <p>Due: {note.dueDate.toLocaleDateString()}</p>

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

                <label htmlFor={`body-${note.id}`}>Note</label>
                <textarea id={`body-${note.id}`} name="body" rows={8} defaultValue={note.body} />
                <button type="submit">save</button>
              </form>
            </details>
            <time dateTime={note.createdAt.toISOString()}>
              {note.createdAt.toLocaleString()}
            </time>
          </li>
        ))}
      </ul>
    </main>
  );

}
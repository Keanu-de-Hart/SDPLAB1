import { createNote } from "./actions";
import { prisma } from "@/lib/prisma";
import { updateNote } from "./actions";

export default async function Home() {

  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1>Notes</h1>

      <details>
        <summary>New Note</summary>
      <form action={createNote}>

        <label htmlFor="body">Note</label>
        <textarea id="body" name="body" rows={8} />
        <button type="submit">save</button>
      </form>
      </details>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <details>
              <summary>{note.body}</summary>
              <form action={updateNote.bind(null, note.id)}>
                <textarea name="body" rows={8} defaultValue={note.body} />
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
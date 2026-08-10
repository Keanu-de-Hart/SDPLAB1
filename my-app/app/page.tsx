import { createNote } from "./actions";
import { prisma } from "@/lib/prisma";


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
            <p className="whitespace-pre-wrap">{note.body}</p>
            <time dateTime={note.createdAt.toISOString()}>
              {note.createdAt.toLocaleString()}
            </time>
          </li>
        ))}
      </ul>
    </main>
  );

}
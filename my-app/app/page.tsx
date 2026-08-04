import { createNote } from "./actions";

export default function Home() {
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
    </main>
  );

}
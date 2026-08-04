import { createNote } from "./actions";

export default function Home() {
  return (
    <main>
      <h1>New note</h1>

      <form action={createNote}>

        <label htmlFor="body">Note</label>
        <textarea id="body" name="body" rows={8} />
        <button type="submit">save</button>
      </form>
    </main>
  );

}
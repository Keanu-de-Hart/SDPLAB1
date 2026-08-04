"use client";

import { useActionState } from "react";
import { createUser, type FormState } from "./actions";

// "use client" marks this as a Client Component: it ships JavaScript to the
// browser so it can hold state. It's needed here only because we want to show
// a pending state and an error message. The <form> below still calls a Server
// Action — the action itself never runs in the browser.

const initialState: FormState = {};

export function UserForm() {
  // useActionState wires the form to the action and hands back:
  //   state   - whatever the action returned last time (our error, if any)
  //   action  - the wrapped action to pass to <form action={...}>
  //   pending - true while the request is in flight
  const [state, action, pending] = useActionState(createUser, initialState);

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="name"
          placeholder="Name"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "Adding…" : "Add user"}
        </button>
      </div>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
    </form>
  );
}

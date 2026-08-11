# my-app

A small task manager built with Next.js, Prisma, and SQLite. Tasks have a title, description, due date, topic, and a fixed status (Todo / In-Progress / Complete); they can be archived but not deleted.

## Third-Party Code

| Package | Why it's here |
|---|---|
| [`next`](https://nextjs.org) | The framework itself — provides the App Router, Server Components, and Server Actions the app is built on. |
| [`react`](https://react.dev) / [`react-dom`](https://react.dev) | Required by Next.js to render the UI; Next is built on top of React. |
| [`@prisma/client`](https://www.prisma.io/docs/orm/prisma-client) | The generated, type-safe database client used at runtime to read and write tasks — this is what `actions.ts` and `page.tsx` actually call. |
| [`prisma`](https://www.prisma.io/docs/orm/tools/prisma-cli) | The CLI used during development to write migrations, apply them, and regenerate `@prisma/client` after a schema change. Not used at runtime, only while building the app. |
| [`typescript`](https://www.typescriptlang.org) | Static typing — catches mistakes like passing the wrong field name to a Prisma query before the app ever runs. |
| [`tailwindcss`](https://tailwindcss.com) / `@tailwindcss/postcss` | Utility-class styling (e.g. the red "overdue" text) without hand-writing CSS files. |
| `eslint` / `eslint-config-next` | Lints the code against Next.js's recommended rules, catching common mistakes (unused variables, bad imports) before they become bugs. |
| `@types/node`, `@types/react`, `@types/react-dom` | Type definitions so TypeScript understands Node's and React's APIs; they add no runtime code. |
| [`vitest`](https://vitest.dev) | Test runner for `npm test` — chosen over Jest because it needs no extra configuration to run TypeScript/ESM directly, which keeps the setup small for a project this size. |

No other libraries were pulled in beyond what `create-next-app` and `prisma init` set up by default.

## Database Design

The app uses **SQLite**, a single-file database — the whole database lives in `prisma/dev.db`, which Prisma creates and updates for you (see [Running It](#running-it)). The schema is defined in [`prisma/schema.prisma`](prisma/schema.prisma) and applied to that file through migrations in `prisma/migrations/`.

There are two tables:

### `Task`

The core table — every task on the page is one row here.

| Column | Type | Notes |
|---|---|---|
| `id` | Int | Primary key, auto-increments. |
| `title` | String | Required. |
| `body` | String | Required free-text note field, separate from `description`. |
| `description` | String | Required. |
| `dueDate` | DateTime | Required. |
| `topic` | String | Required, plain text (no fixed list). |
| `status` | Enum (`Status`) | One of `Todo`, `InProgress`, `Complete`. Defaults to `Todo`. This is a database-level enum, so no other value can ever be stored. |
| `archived` | Boolean | Defaults to `false`. Archiving a task sets this to `true` instead of deleting the row — the task list filters on `archived: false`, so archived tasks simply stop appearing rather than being destroyed. |
| `createdAt` | DateTime | Set automatically when the row is created. |

### `User`

| Column | Type | Notes |
|---|---|---|
| `id` | Int | Primary key, auto-increments. |
| `name` | String | Required. |
| `email` | String | Required, unique. |
| `createdAt` | DateTime | Set automatically when the row is created. |

**Relationships:** none. `User` and `Task` are two independent tables — there's no foreign key linking a task to a user. `User` was scaffolded early on and isn't currently read or written anywhere in the app; tasks aren't owned by anyone yet. If multi-user support is added later, that would mean adding a `userId` foreign key on `Task` referencing `User.id`.

## Running It

**Requires Node.js 20.9 or later** (the minimum Next.js 16 supports).

From a clean clone, with nothing else set up:

```bash
# 1. Move into the app directory — this is where package.json, prisma/, etc. live
cd my-app

# 2. Install dependencies
npm install

# 3. Point Prisma at a local SQLite file
#    (.env is gitignored, so this file won't exist yet after a fresh clone)
echo 'DATABASE_URL="file:./dev.db"' > .env

# 4. Create the database and apply all migrations
#    (this also generates the Prisma Client used by the app code)
npx prisma migrate dev

# 5. Start the app
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Testing

```bash
npm test
```

That's the one command — it runs against a real, separate SQLite database (`prisma/test.db`, distinct from your dev database so tests never touch or clear your real data), applying migrations to it automatically before the tests run (via the `pretest` script in `package.json`), then executes [`tests/actions.test.ts`](tests/actions.test.ts). There are three tests, each exercising a real Server Action end-to-end against that database (no mocking):

1. `createNote` actually inserts a task and every field is read back correctly.
2. `updateNote` actually changes an existing task's fields.
3. `archiveTask` actually sets `archived: true`, and the task then genuinely disappears from a query filtered on `archived: false` — the same query `page.tsx` uses for the visible list.

Beyond the automated suite, it's still worth clicking through the UI by hand at least once:

1. Run `npm run dev` and open the app in a browser.
2. Expand "New Note", fill in a title/description/due date/topic/status, and save — confirm it appears in the list.
3. Create a task with a due date in the past and a status other than Complete, and confirm it's shown in red as overdue.
4. Click each "Sort by" link (Topic, Status, Due Date) and confirm the list order changes accordingly.

To type-check the project without running it:

```bash
npx tsc --noEmit
```

To lint it:

```bash
npm run lint
```

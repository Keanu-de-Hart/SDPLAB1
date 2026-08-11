process.env.DATABASE_URL = "file:./test.db";
require("node:child_process").execSync("npx prisma migrate deploy", { stdio: "inherit" });

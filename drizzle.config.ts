import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

export default defineConfig({
  schema: "./schema.ts",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl, //"postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
  },
});

import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();

  if (!result) {
    throw new Error("This user alreasy exists");
  }

  return result;
}

export async function getUser(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  if (!result) {
    throw new Error("This account does not exist");
  }
  return result.name;
}

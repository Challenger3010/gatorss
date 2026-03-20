import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {
  try {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
  } catch (e) {
    return;
  }
}

export async function getUser(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));

  return result;
}
export async function getUserById(id: string) {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  if (!result) {
    throw new Error("This account does not exist");
  }
  return result;
}

export async function getUsers() {
  const result = await db.select().from(users);

  return result;
}

export async function resetUserTable() {
  const [result] = await db.delete(users);
}

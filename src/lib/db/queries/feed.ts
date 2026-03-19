import { db } from "..";
import { eq } from "drizzle-orm";
import { feeds } from "../schema";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();

  return result;
}

export async function getAllFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByUserId(userId: string) {
  const [result] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.userId, userId));
  if (!result) {
    throw new Error("This account does not exist");
  }
  return result;
}

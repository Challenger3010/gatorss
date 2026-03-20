import { db } from "..";
import { eq, or } from "drizzle-orm";
import { feeds, feed_follows, users } from "../schema";
import { abort } from "node:process";

export type Feed = typeof feeds.$inferSelect;
export type FeedFollow = typeof feed_follows.$inferSelect;

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
export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  if (!result) {
    throw new Error("This account does not exist");
  }
  return result;
}

export async function createFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .insert(feed_follows)
    .values({ userId: userId, feedId: feedId })
    .returning();

  let all = await db
    .select()
    .from(feed_follows)
    .innerJoin(users, eq(feed_follows.userId, users.id))
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
    .where(eq(feed_follows.id, result.id));

  return all;
}

export async function getFollowedFeeds(userId: string) {
  const result = await db
    .select()
    .from(feed_follows)
    .innerJoin(users, eq(feed_follows.userId, users.id))
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
    .where(eq(feed_follows.userId, userId));

  return result;
}

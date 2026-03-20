import { db } from "..";
import { eq, or, sql } from "drizzle-orm";
import { feeds, feed_follows, users } from "../schema";
import { abort } from "node:process";
import { fetchFeed } from "src/feed";
import { createPost } from "./post";

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

export async function getFeedById(feedId: string) {
  const result = await db.select().from(feeds).where(eq(feeds.id, feedId));
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

export async function deleteFollowedFeed(userId: string, url: string) {
  const feeds = await getFollowedFeeds(userId);

  for (const feed of feeds) {
    if (feed.feeds.url == url) {
      const result = await db
        .delete(feed_follows)
        .where(eq(feed_follows.feedId, feed.feeds.id));
    }
  }
}

export async function markFeedFetched(feed: Feed) {
  await db
    .update(feeds)
    .set({
      updatedAt: new Date(),
      lastFetchedAt: new Date(),
    })
    .where(eq(feeds.id, feed.id));
}

export async function getNextFeedToFetch() {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
    .limit(1);

  return feed;
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  await markFeedFetched(nextFeed);

  const feed = await fetchFeed(nextFeed.url);

  console.log(`Channel: ${feed.rss.channel.title}`);
  console.log(`Description: ${feed.rss.channel.description}`);
  console.log(`Link: ${feed.rss.channel.link}`);
  console.log("Items:");
  feed.rss.channel.item.forEach(async (item) => {
    await createPost(item, nextFeed.id);
  });
  console.log("------------------------------\n\n");
}

export async function resetFeedTable() {
  const [result] = await db.delete(feeds);
}

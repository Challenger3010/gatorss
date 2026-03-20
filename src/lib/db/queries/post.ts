import { db } from "..";
import { eq, or, sql } from "drizzle-orm";
import { feeds, feed_follows, users, posts } from "../schema";
import { Feed, getFeedById } from "./feed";
import { RSSItem } from "src/feed";

export async function createPost(feed: RSSItem, feedId: string) {
  const [result] = await db.insert(posts).values({
    description: feed.description,
    title: feed.title,
    publishedAt: new Date(feed.pubDate),
    feedId: feedId,
  });
}

export async function getPostForUser(limit: number, feedId: string) {
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.feedId, feedId))
    .orderBy(sql`${posts.createdAt} ASC`)
    .limit(limit);

  return post;
}

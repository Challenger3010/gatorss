import { readConfig, setUser } from "./config";
import {
  createUser,
  getUser,
  getUserById,
  getUsers,
  resetUserTable,
  User,
} from "./lib/db/queries/user";
import { fetchFeed } from "./feed";
import {
  createFeed,
  createFeedFollow,
  deleteFollowedFeed,
  Feed,
  getAllFeeds,
  getFeedByUrl,
  getFeedByUserId,
  getFollowedFeeds,
} from "./lib/db/queries/feed";

export async function loginHandler(cmdName: string, ...args: string[]) {
  if (args.length == 0) {
    throw new Error("Expected at least one argument (username)");
  }

  const userName = args[0];

  const dbUser = await getUser(userName);

  if (!dbUser) {
    console.log("User does not exist");
    return;
  }

  setUser(dbUser.name);
  console.log(`The user ${dbUser.name} has been set`);
}

export async function registerHandler(cmdName: string, ...args: string[]) {
  if (args.length == 0) {
    throw new Error("Expected at least one argument (username)");
  }

  const userName = args[0];

  const registeredUser = await createUser(userName);

  if (!registeredUser) {
    console.log("User already exists!");
    return;
  }

  setUser(registeredUser.name);
  console.log(`The user ${registeredUser.name} was created`);
}

export async function resetHandler(cmdName: string, ...args: string[]) {
  await resetUserTable();
}

export async function allUsersHandler(cmdName: string, ...args: string[]) {
  if (args.length > 0) {
    console.log("Unknown options");
    console.log(...args);
    console.log("Command doesn't have args");
    return;
  }

  let users = await getUsers();
  let curUser = readConfig().currentUserName;

  users.forEach((user) => {
    console.log(
      `${curUser == user.name ? `${user.name} (current)` : user.name}`,
    );
  });
}

export async function aggHandler(cmdName: string, ...args: string[]) {
  let feed = await fetchFeed("https://www.wagslane.dev/index.xml");

  console.log(`Channel: ${feed.rss.channel.title}`);
  console.log(`Description: ${feed.rss.channel.description}`);
  console.log(`Link: ${feed.rss.channel.link}`);
  console.log("Items:");
  console.log("Optimize for simplicity");
  feed.rss.channel.item.forEach((item) => {
    console.log(item.title);
  });
}

export async function addFeedHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let name = args[0];
  let url = args[1];

  let res: Feed = await createFeed(name, url, user.id);
  console.log("Feed added:");
  console.log("-------------------");
  console.log(res.name);
  console.log("-------------------\n\n");
  await followHandler(cmdName, user, url);
}

export async function allFeedsHandler(cmdName: string, ...args: string[]) {
  const allFeeds = await getAllFeeds();

  console.log("Feeds:");
  console.log("-------------------");
  for (const feed of allFeeds) {
    const user = await getUserById(feed.userId);
    console.log("Feed name: ", feed.name);
    console.log("URL: ", feed.url);
    console.log("User: ", user.name);
  }
  console.log("-------------------");
}

export async function printFeed(feed: Feed, user: User) {
  console.log("Feed: ", feed);
  console.log("User: ", user);
}

export async function followHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const url = args[0];

  const feed: Feed = await getFeedByUrl(url);

  const follow = await createFeedFollow(user.id, feed.id);

  console.log("Now follwing:");
  console.log("-------------------");
  console.log(`Feed Name: ${follow[0].feeds.name}`);
  console.log(`Current User Name: ${user.name}`);
}

export async function followingHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let feeds = await getFollowedFeeds(user.id);

  if (!feeds || feeds.length == 0) {
    console.log("You are not following anything!");
    console.log("See all feeds with the 'feeds' command");
    console.log("The follow it with 'follow <feed_url>'");
    return;
  }

  console.log(`${user.name} is following:`);
  console.log("-------------------");
  for (const feed of feeds) {
    console.log(feed.feeds.name);
  }
  console.log("-------------------");
}

export async function unfollowgHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let test = await deleteFollowedFeed(user.id, args[0]);
  console.log("Feed deleted");
}

export async function getCurrentUser() {
  let configUser = readConfig().currentUserName;
  let curUser: User = await getUser(configUser);

  if (!curUser) {
    throw new Error(`User ${curUser} not found`);
  }
  return curUser;
}

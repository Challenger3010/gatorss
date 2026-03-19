import { readConfig, setUser } from "./config";
import {
  createUser,
  getUser,
  getUsers,
  resetUserTable,
} from "./lib/db/queries/user";
import { fetchFeed } from "./feed";

export async function loginHandler(cmdName: string, ...args: string[]) {
  if (args.length == 0) {
    throw new Error("Expected at least one argument (username)");
  }

  const userName = args[0];

  const dbUserName = await getUser(userName);

  setUser(dbUserName);
  console.log(`The user ${dbUserName} has been set`);
}

export async function registerHandler(cmdName: string, ...args: string[]) {
  if (args.length == 0) {
    throw new Error("Expected at least one argument (username)");
  }

  const userName = args[0];

  const registeredUser = await createUser(userName);
  console.log(registeredUser);

  setUser(registeredUser.name);
  console.log(`The user ${registeredUser.name} was created`);
}

export async function resetHandler(cmdName: string, ...args: string[]) {
  await resetUserTable();
}

export async function allUsersHandler(cmdName: string, ...args: string[]) {
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

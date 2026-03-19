import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/user";

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

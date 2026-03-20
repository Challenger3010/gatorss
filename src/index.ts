import {
  CommandsRegistry,
  middlewareLogIn,
  registerCommand,
  runCommand,
} from "./commands";

import {
  addFeedHandler,
  aggHandler,
  allFeedsHandler,
  allUsersHandler,
  followHandler,
  followingHandler,
  loginHandler,
  registerHandler,
  resetHandler,
  unfollowgHandler,
} from "./handlers";

async function main() {
  const registry: CommandsRegistry = {};

  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  let cmdName = args[0];
  let cmdArgs = args.slice(1);

  registerCommand(registry, "register", registerHandler);
  registerCommand(registry, "users", allUsersHandler);
  registerCommand(registry, "reset", resetHandler);
  registerCommand(registry, "login", loginHandler);
  registerCommand(registry, "agg", aggHandler);
  registerCommand(registry, "addfeed", middlewareLogIn(addFeedHandler));
  registerCommand(registry, "feeds", allFeedsHandler);
  registerCommand(registry, "follow", middlewareLogIn(followHandler));
  registerCommand(registry, "following", middlewareLogIn(followingHandler));
  registerCommand(registry, "unfollow", middlewareLogIn(unfollowgHandler));

  await runCommand(registry, cmdName, ...cmdArgs);

  process.exit(0);
}

main();

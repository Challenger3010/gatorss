import { CommandsRegistry, registerCommand, runCommand } from "./commands";

import {
  addFeedHandler,
  aggHandler,
  allUsersHandler,
  loginHandler,
  registerHandler,
  resetHandler,
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
  registerCommand(registry, "addfeed", addFeedHandler);

  await runCommand(registry, cmdName, ...cmdArgs);

  process.exit(0);
}

main();

import { CommandsRegistry, registerCommand, runCommand } from "./commands";

import { loginHandler, registerHandler } from "./handlers";

async function main() {
  const registry: CommandsRegistry = {};

  let allArgs = process.argv;
  let args = allArgs.slice(2);

  if (args.length == 0) {
    throw new Error("Please provide at least one argument");
  }
  if (args.length == 1) {
    throw new Error("A username is required");
  }

  let cmdName = args[0];
  let cmdArgs = args.slice(1);

  if (cmdName == "register") {
    registerCommand(registry, cmdName, registerHandler);
  } else {
    registerCommand(registry, cmdName, loginHandler);
  }

  await runCommand(registry, cmdName, ...cmdArgs);

  process.exit(0);
}

main();

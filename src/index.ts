import { exit } from "node:process";
import {
  CommandsRegistry,
  loginHandler,
  registerCommand,
  runCommand,
} from "./commands";
import { readConfig, setUser } from "./config";

function main() {
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

  registerCommand(registry, cmdName, loginHandler);
  runCommand(registry, cmdName, ...cmdArgs);
}

main();

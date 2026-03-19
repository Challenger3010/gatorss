import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function loginHandler(cmdName: string, ...args: string[]) {
  if (args.length == 0) {
    throw new Error("Expected at least one argument (username)");
  }

  setUser(args[0]);
  console.log(`The user ${args[0]} has been set`);
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  handler(cmdName, ...args);
}

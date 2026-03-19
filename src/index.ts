import { readConfig, setUser } from "./config";

function main() {
  setUser("Nick");
  const cfg = readConfig();
  console.log(cfg);
}

main();

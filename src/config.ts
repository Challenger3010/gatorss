import fs, { unwatchFile } from "fs";
import os, { userInfo } from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(name: string) {
  const config = readConfig();
  config.currentUserName = name;
  writeConfig(config);
}

export function readConfig() {
  const fullPath = getConfigFilePath();

  const data = fs.readFileSync(fullPath, "utf-8");
  const rawConfig = JSON.parse(data);

  return validateConfig(rawConfig);
}

function getConfigFilePath() {
  const configFileName = ".gatorconfig.json";
  const homeDir = os.homedir();
  return path.join(homeDir, configFileName);
}

function writeConfig(cfg: Config) {
  const fullPath = getConfigFilePath();

  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
}

function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}

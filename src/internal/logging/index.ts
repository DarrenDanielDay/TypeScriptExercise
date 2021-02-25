import fs from "fs";
import { toJson } from "../../utils/json/to-json";
export type LoggingLevel = "INFO" | "WARN" | "ERROR" | "FATAL";
export type LoggingMethod = (message: string, ...args: unknown[]) => void;
export type ILogging = {
  [K in Lowercase<LoggingLevel>]: LoggingMethod;
};

export function log(level: LoggingLevel, message: string, ...args: unknown[]) {
  const method: Record<LoggingLevel, LoggingMethod> = {
    INFO: console.log,
    WARN: console.warn,
    ERROR: console.error,
    FATAL: console.error,
  };
  method[level](message, ...args);
}
let logFileName = "internal-logs.log";

const logToFile: LoggingMethod = (message, ...args) => {
  fs.appendFileSync(
    logFileName,
    `${message} ${args.map((arg) => toJson(arg))}`
  );
};

export function setLogFilePath(fileName: string) {
  logFileName = fileName;
}

export function fileLog(
  fileName: string,
  level: LoggingLevel,
  message: string,
  ...args: unknown[]
) {
  setLogFilePath(fileName);
  logToFile(`[${level}] ${message}`, ...args);
}

export const consoleLogger: ILogging = {
  info(message, ...args) {
    log("INFO", message, ...args);
  },
  warn(message, ...args) {
    log("WARN", message, ...args);
  },
  error(message, ...args) {
    log("ERROR", message, ...args);
  },
  fatal(message, ...args) {
    log("FATAL", message, ...args);
  },
};

export const fileLogger: ILogging = {
  info(message, ...args) {
    logToFile("INFO", message, ...args);
  },
  warn(message, ...args) {
    logToFile("WARN", message, ...args);
  },
  error(message, ...args) {
    logToFile("ERROR", message, ...args);
  },
  fatal(message, ...args) {
    logToFile("FATAL", message, ...args);
  },
};

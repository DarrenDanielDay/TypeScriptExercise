export type LoggingLevel = "INFO" | "WARN" | "ERROR" | "FATAL";
export type LoggingMethod = (message: string, ...args: any[]) => void;
export type ILogging = {
  [K in Lowercase<LoggingLevel>]: LoggingMethod;
};

export function log(level: LoggingLevel, message: string, ...args: any[]) {
  const method: Record<LoggingLevel, LoggingMethod> = {
    INFO: console.log,
    WARN: console.warn,
    ERROR: console.error,
    FATAL: console.error,
  };
  method[level](message, ...args);
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

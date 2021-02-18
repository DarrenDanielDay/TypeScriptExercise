import * as Logging from "./logging";
import * as Exception from "./exceptions";

let internalLogger = Logging.consoleLogger;

export function useLogger(logger: Logging.ILogging) {
  internalLogger = logger;
}

export function warn(message: string, ...args: unknown[]) {
  internalLogger.warn(message, ...args);
}

export function info(message: string, ...args: unknown[]) {
  internalLogger.info(message, ...args);
}

export function error(message: string, ...args: unknown[]) {
  internalLogger.error(message, ...args);
  return Exception.error(message);
}

export function fatal(message: string, ...args: unknown[]) {
  internalLogger.fatal(message, ...args);
  return Exception.error(message);
}

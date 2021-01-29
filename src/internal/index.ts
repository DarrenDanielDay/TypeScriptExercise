import * as Logging from "./logging";
import * as Exception from "./exceptions";

const logger = Logging.consoleLogger;

export function warn(message: string, ...args: unknown[]) {
  logger.warn(message, ...args);
}

export function info(message: string, ...args: unknown[]) {
  logger.info(message, ...args);
}

export function error(message: string, ...args: unknown[]) {
  logger.error(message, ...args);
  return Exception.error(message);
}

export function fatal(message: string, ...args: unknown[]) {
  logger.fatal(message, ...args);
  return Exception.error(message);
}

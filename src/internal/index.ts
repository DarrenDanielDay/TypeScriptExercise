import * as Logging from "./logging";
import * as Exception from "./exceptions";

const logger = Logging.consoleLogger;

export function warn(message: string, ...args: any[]) {
  logger.warn(message, ...args);
}

export function info(message: string, ...args: any[]) {
  logger.info(message, ...args);
}

export function error(message: string, ...args: any[]) {
  logger.error(message, ...args);
  return Exception.error(message);
}

export function fatal(message: string, ...args: any[]) {
  logger.fatal(message, ...args);
  return Exception.error(message);
}

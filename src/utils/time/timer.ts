import { Internal } from "../..";
import { Func } from "../../types/util-types";

export const timer = (
  callback: Func<unknown[], unknown>,
  ...args: unknown[]
) => {
  const start = new Date();
  const result = callback(...args);
  const end = new Date();
  Internal.info(`Execute time: ${end.getTime() - start.getTime()} ms`);
  return result;
};

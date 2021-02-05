import { Internal } from "../..";
import { UtilTypes } from "../../types";

export const timer = (
  callback: UtilTypes.Func<unknown[], unknown>,
  ...args: unknown[]
) => {
  const start = new Date();
  const result = callback(...args);
  const end = new Date();
  Internal.info(`Execute time: ${end.getTime() - start.getTime()} ms`);
  return result;
};

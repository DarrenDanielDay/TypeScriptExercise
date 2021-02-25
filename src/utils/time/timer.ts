import { Internal } from "../..";
import { AnyArray, Func } from "../../types/util-types";

export function timer<Params extends AnyArray, Result>(
  title: string,
  callback: Func<Params, Result>,
  ...args: Params
) {
  const start = new Date();
  const result = callback(...args);
  const end = new Date();
  Internal.info(
    `Execute time for "${title}": ${end.getTime() - start.getTime()} ms`
  );
  return result;
}

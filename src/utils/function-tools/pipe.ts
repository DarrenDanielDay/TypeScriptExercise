import { Func } from "../../types/util-types";
import { asynchronize } from "./asynchronize";
type AnySingleParamFunc = Func<[never], unknown>;
export type Pipe<Initial, Fns extends AnySingleParamFunc[]> = Fns extends [
  infer First,
  ...infer Rest
]
  ? First extends (...args: infer P) => infer R
    ? [Initial] extends P
      ? Rest extends AnySingleParamFunc[]
        ? Pipe<R, [...Rest]>
        : never
      : never
    : never
  : Initial;

export function pipe<T, Params extends AnySingleParamFunc[]>(
  init: T,
  ...t: Params
): Pipe<T, Params> {
  let returnValue: unknown = init;
  for (const fn of t) {
    returnValue = fn.call(undefined, returnValue as never);
  }
  return returnValue as never;
}

export async function pipeAsync<T, Params extends AnySingleParamFunc[]>(
  init: T,
  ...t: Params
): Promise<Pipe<T, Params>> {
  let returnValue: unknown = init;
  for (const fn of t) {
    returnValue = await asynchronize(fn.bind(undefined, returnValue as never));
  }
  return returnValue as never;
}

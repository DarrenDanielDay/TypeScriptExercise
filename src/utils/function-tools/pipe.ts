import { Func } from "../../types/util-types";
import { asynchronize } from "./asynchronize";

export type Pipe<Initial, Fns extends Func<[any], unknown>[]> = Fns extends [
  infer First,
  ...infer Rest
]
  ? First extends (...args: infer P) => infer R
    ? [Initial] extends P
      ? Rest extends Func<[any], unknown>[]
        ? Pipe<R, [...Rest]>
        : never
      : never
    : never
  : Initial;

export function pipe<T, Params extends Func<[any], unknown>[]>(
  init: T,
  ...t: Params
): Pipe<T, Params> {
  let returnValue: unknown = init;
  for (const fn of t) {
    returnValue = fn.call(undefined, returnValue);
  }
  return returnValue as never;
}

export async function pipeAsync<T, Params extends Func<[any], unknown>[]>(
  init: T,
  ...t: Params
): Promise<Pipe<T, Params>> {
  let returnValue: unknown = init;
  for (const fn of t) {
    returnValue = await asynchronize(fn.bind(undefined, returnValue));
  }
  return returnValue as never;
}

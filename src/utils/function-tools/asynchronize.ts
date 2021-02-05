import { UtilTypes } from "../../types";

export function asynchronize<Params extends unknown[], Result>(
  fn: (...args: Params) => Result,
  ...args: Params
): UtilTypes.Promisefy<Result> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = fn.apply(undefined, args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 0);
  }) as never;
}

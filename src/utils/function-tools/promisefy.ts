import { Promisefy } from "../../types/util-types";

export function promisefy<T>(obj: T): Promisefy<T> {
  return Promise.resolve(obj) as never;
}

import { UtilTypes } from "../../types";

export function promisefy<T>(obj: T): UtilTypes.Promisefy<T> {
  return Promise.resolve(obj) as never;
}

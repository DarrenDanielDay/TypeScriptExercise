import { UtilTypes } from "../../types";

export function pick<T, Keys extends (keyof T)[]>(
  obj: T,
  ...keys: Keys
): Pick<
  T,
  UtilTypes.TupleUnion<Keys> extends keyof T
    ? UtilTypes.TupleUnion<Keys>
    : never
> {
  const result: Partial<T> = {};
  for (let key of keys) {
    result[key] = obj[key];
  }
  return result as never;
}

import { TupleUnion } from "../../types/util-types";

export function pick<T, Keys extends (keyof T)[]>(
  obj: T,
  ...keys: Keys
): Pick<T, TupleUnion<Keys> extends keyof T ? TupleUnion<Keys> : never> {
  const result: Partial<T> = {};
  for (let key of keys) {
    result[key] = obj[key];
  }
  return result as never;
}

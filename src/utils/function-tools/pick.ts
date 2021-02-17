import { ObjectEntries } from "../../types/es5";
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

export function pickEnumerableStringKey<T>(
  obj: T
): Pick<T, Extract<keyof T, string>> {
  const descriptors = Object.getOwnPropertyDescriptors(obj) as {
    [P in Extract<keyof T, string>]: TypedPropertyDescriptor<T[P]>;
  };
  const entries = Object.entries(descriptors) as ObjectEntries<
    typeof descriptors
  >;
  return entries.reduce<Pick<T, Extract<keyof T, string>>>(
    (prev, [key, value]) => (
      value.enumerable && (prev[key] = value.value!), prev
    ),
    {} as never
  );
}

export const pickKey = <T>(key: keyof T) => key;

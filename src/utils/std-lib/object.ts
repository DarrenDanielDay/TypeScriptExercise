import { ObjectEntries } from "../../types/es5";

/**
 * Same logic with `Object.keys` but with better type inference.
 * @param obj the object
 */
export function keys<T>(obj: T) {
  return Object.keys(obj) as Extract<keyof T, string>[];
}

/**
 * Same logic with `Object.entries` but with better type inference.
 * @param obj the object
 */
export function entries<T>(obj: T): ObjectEntries<T> {
  return Object.entries(obj) as ObjectEntries<T>;
}

/**
 * Same logic with `Object.getOwnPropertyDescriptors` but no string signature.
 * @param obj the object
 */
export function getOwnPropertyDescriptors<T>(
  obj: T
): { [K in keyof T]: TypedPropertyDescriptor<T[K]> } {
  return Object.getOwnPropertyDescriptors(obj);
}

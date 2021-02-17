/**
 * Same logic with `Object.keys` but with better type inference.
 * @param obj the object
 */
export function keys<T>(obj: T) {
  return Object.keys(obj) as Extract<keyof T, string>[];
}

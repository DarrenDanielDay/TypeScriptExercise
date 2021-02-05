export const isNumber = (obj: unknown): obj is number =>
  typeof obj === "number";
export const isString = (obj: unknown): obj is string =>
  typeof obj === "string";
export const isSymbol = (obj: unknown): obj is symbol =>
  typeof obj === "symbol";
export const isBigInt = (obj: unknown): obj is bigint =>
  typeof obj === "bigint";
export const isFunction = (obj: unknown): obj is Function =>
  typeof obj === "function";
export const isUndefined = (obj: unknown): obj is undefined =>
  typeof obj === "undefined";
export const isEqual = <T>(obj: unknown, value: T): obj is T => obj === value;

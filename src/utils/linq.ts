import { UtilTypes } from "../types";

export function select<T, R>(this: T[], selector: UtilTypes.Mapper<T, R>): R[] {
  return Array.prototype.map.call(this, selector);
}

export function where<T>(this: T[], predicate: UtilTypes.Predicate<T>): T[] {
  return Array.prototype.filter.call(this, predicate);
}
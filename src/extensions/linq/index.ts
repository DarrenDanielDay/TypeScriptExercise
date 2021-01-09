import { injector } from "../../globals";
import { Extensions } from "../../interfaces";
import { UtilTypes } from "../../types";

function* select<T, R>(this: T[], selector: UtilTypes.Mapper<T, R>) {
  for (let item of this) {
    yield selector(item);
  }
}

function* where<T>(this: T[], predicate: UtilTypes.Predicate<T>) {
  for (let item of this) {
    predicate(item) && (yield item);
  }
}

export class QuerySequence<T> {
  constructor(private iterable: Iterable<T>) {}
  [Symbol.iterator]() {
    return this.iterable[Symbol.iterator]();
  }
  select<R>(selector: UtilTypes.Mapper<T, R>) {
    return new QuerySequence<R>(select.call(this, selector));
  }
  where(predicate: UtilTypes.Predicate<T>) {
    return new QuerySequence<T>(where.call(this, predicate));
  }
  toList() {
    return [...this.iterable];
  }
}
export const LinqExtension: Extensions.IExtension = {
  name: "linq",
  install() {
    Array.prototype.select = function <T, R>(
      this: T[],
      selector: UtilTypes.Mapper<T, R>
    ) {
      return new QuerySequence<T>(this).select(selector);
    };

    Array.prototype.where = function <T>(
      this: T[],
      predicate: UtilTypes.Predicate<T>
    ) {
      return new QuerySequence<T>(this).where(predicate);
    };

    Array.prototype;
  },
  uninstall() {
    delete Array.prototype.select;
    delete Array.prototype.where;
  },
};

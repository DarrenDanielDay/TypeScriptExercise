import { autobind } from "core-decorators";
import { Extensions } from "../../interfaces";
import { makeMethodExtension } from "../../interfaces/extensions";
import { UtilTypes } from "../../types";
declare global {
  interface Array<T> {
    select<R>(selector: UtilTypes.Func<[T], R>): QuerySequence<T>;
    where(predicate: UtilTypes.Func<[T], boolean>): QuerySequence<T>;
  }
}

function* select<T, R>(this: Iterable<T>, selector: UtilTypes.Mapper<T, R>) {
  for (let item of this) {
    yield selector(item);
  }
}

function* where<T>(this: Iterable<T>, predicate: UtilTypes.Predicate<T>) {
  for (let item of this) {
    predicate(item) && (yield item);
  }
}

@autobind
export class QuerySequence<T> implements Iterable<T> {
  constructor(public readonly iterable: Iterable<T>) {}
  [Symbol.iterator]() {
    return this.iterable[Symbol.iterator]();
  }
  select<R>(selector: UtilTypes.Mapper<T, R>) {
    return new QuerySequence<R>(select.call(this.iterable, selector));
  }
  where(predicate: UtilTypes.Predicate<T>) {
    return new QuerySequence<T>(where.call(this.iterable, predicate));
  }
  toList() {
    return [...this.iterable];
  }
}
export const LinqExtension: Extensions.IExtension<
  Array<unknown>
> = makeMethodExtension(Array, {
  select(selector) {
    return new QuerySequence(this).select(selector);
  },
  where(predicate) {
    return new QuerySequence(this).where(predicate);
  },
});

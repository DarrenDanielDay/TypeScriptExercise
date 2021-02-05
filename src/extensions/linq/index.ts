import { autobind } from "core-decorators";
import { Extensions } from "../../interfaces";
import { makeMethodExtension } from "../../interfaces/extensions";
import {} from "../../types";
import { Func, Mapper, Predicate } from "../../types/util-types";
declare global {
  interface Array<T> {
    select<R>(selector: Func<[T], R>): QuerySequence<T>;
    where(predicate: Func<[T], boolean>): QuerySequence<T>;
  }
}

function* select<T, R>(this: Iterable<T>, selector: Mapper<T, R>) {
  for (let item of this) {
    yield selector(item);
  }
}

function* where<T>(this: Iterable<T>, predicate: Predicate<T>) {
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
  select<R>(selector: Mapper<T, R>) {
    return new QuerySequence<R>(
      select.call(this.iterable, selector as never) as never
    );
  }
  where(predicate: Predicate<T>) {
    return new QuerySequence<T>(
      where.call(this.iterable, predicate as never) as never
    );
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

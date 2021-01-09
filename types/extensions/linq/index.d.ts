interface Array<T> {
  select<R>(selector: (item: T) => R): QuerySequence<T>;
  where(predicate: (item: T) => boolean): QuerySequence<T>;
}

declare class QuerySequence<T> implements Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
  select<R>(selector: (item: T) => R): QuerySequence<T>;
  where(predicate: (item: T) => boolean): QuerySequence<T>;
  toList(): T[];
}

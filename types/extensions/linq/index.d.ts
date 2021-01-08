interface Array<T> {
  select<R>(selector: (item: T) => R): Iterable<T>;
  where(predicate: (item: T) => boolean): Iterable<T>;
}

type GT = 2;

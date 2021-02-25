export interface Container<T> {
  readonly empty: boolean;
  readonly size: number;
  readonly entries: Iterable<T>;
}

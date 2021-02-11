export function getType<T>(): T {
  return null as never;
}
export function echo<T>(obj: T): T {
  return obj;
}

export type Compare<A, B> = A extends B
  ? B extends A
    ? "Equal"
    : "Inferior"
  : B extends A
  ? "Superior"
  : "None";

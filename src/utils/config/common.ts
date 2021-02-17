export const $constraints = Symbol("$constraints");
export function withConstraints<T>(): T {
  return $constraints as never;
}

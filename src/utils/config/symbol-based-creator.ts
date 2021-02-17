import { $constraints } from "./common";

export const $change = Symbol("$change");
export type Replaced<T extends object, RK extends keyof T, RT> = {
  [K in keyof T]: K extends RK ? RT : T[K];
};

type Changer<
  T extends object,
  Constraints extends Record<keyof T, unknown> = Record<keyof T, unknown>
> = {
  [$change]<K extends keyof T, RT extends Constraints[K]>(
    key: K,
    replace: RT
  ): Config<Replaced<T, K, RT>, Constraints>;
};

type Config<
  T extends object,
  Constraints extends Record<keyof T, unknown> = Record<keyof T, unknown>
> = T & Constraints & Changer<T, Constraints>;

export function createConfig<
  T extends object,
  Constraints extends Record<keyof T, unknown> = Record<keyof T, unknown>
>(config: T, constraints?: Constraints) {
  if (arguments.length > 1 && constraints !== ($constraints as never))
    throw new Error("Invalid usage.");
  return Object.defineProperty(
    Object.assign(Object.create(null), config),
    $change,
    {
      writable: false,
      enumerable: false,
      value: function (this: T, key: keyof T, value: never) {
        value !== $change && (this[key] = value);
        return this;
      },
    }
  ) as Config<T, Constraints>;
}

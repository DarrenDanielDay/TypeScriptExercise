import { Internal } from "../..";
import { TypedObject } from "../std-lib";
import { capitalize } from "../string";
import { $constraints } from "./common";

export type Replaced<T extends object, RK extends keyof T, RT> = {
  [K in keyof T]: K extends RK ? RT : T[K];
};

type Setters<
  T extends object,
  Constraints extends Record<keyof T, unknown> = Record<keyof T, unknown>
> = {
  [K in Extract<keyof T, string> as `set${Capitalize<K>}`]: <
    RT extends Constraints[K]
  >(
    replace: RT
  ) => Config<Replaced<T, K, RT>, Constraints>;
};

type Config<
  T extends object,
  Constraints extends Record<keyof T, unknown> = Record<keyof T, unknown>
> = T & Constraints & Setters<T, Constraints>;

export function createConfig<
  T extends object,
  Constraints extends Record<keyof T, unknown> = Record<keyof T, unknown>
>(config: T, constraints?: Constraints) {
  if (arguments.length > 1 && constraints !== ($constraints as never))
    throw new Error("Invalid usage.");
  const result = Object.assign(Object.create(null), config) as T;
  const keys = TypedObject.keys(result);
  const targetKeys = keys.map((key) => `set${capitalize(key)}`);
  if (keys.some((key) => targetKeys.includes(key)))
    Internal.warn(
      "Config key maybe rewritten by `Object.defineProperty`",
      config
    );
  return keys.reduce(
    (prev, key) =>
      Object.defineProperty(prev, `set${capitalize(key)}`, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (this: T, value: T[typeof key]) {
          this[key] = value;
          return this;
        },
      }),
    result
  ) as Config<T, Constraints>;
}

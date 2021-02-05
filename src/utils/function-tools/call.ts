import { MethodKeys, Method } from "../../types/util-types";

export function callMethod<
  T,
  K extends MethodKeys<T>,
  P extends Parameters<T[K]> & Iterable<unknown>
>(target: T, key: K, ...params: P) {
  const method: Method<typeof target, P, ReturnType<T[K]>> = target[key];
  method.call(target, ...params);
}

export function hubCall<
  T,
  K extends MethodKeys<T>,
  P extends Parameters<T[K]> & Iterable<unknown>
>(targets: Iterable<T>, key: K, ...params: P) {
  for (const target of targets) {
    callMethod(target, key, ...params);
  }
}

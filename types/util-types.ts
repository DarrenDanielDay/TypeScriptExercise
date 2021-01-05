export type Superior<A, B> = A extends B ? true : false;
export type Inferior<A, B> = Superior<B, A>;
export type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;
export type Union<A, B> = A | B;
export type Intersection<A, B> = A & B;
export type UnionToIntersection<U> = (
  U extends any ? (_: U) => void : never
) extends (_: infer T) => void
  ? T
  : never;

export type KeyTypes = string | number | symbol;
export type PropsKeys<T> = keyof T extends infer K
  ? K extends keyof T
    ? T[K] extends Function
      ? never
      : K
    : never
  : never;
export type MethodKeys<T> = keyof T extends infer K
  ? K extends keyof T
    ? T[K] extends Function
      ? K
      : never
    : never
  : never;
export type PropsOf<T> = { [K in PropsKeys<T>]: T[K] };
export type MethodsOf<T> = { [K in MethodKeys<T>]: T[K] };
export type ItemUnion<T> = keyof T extends infer K
  ? K extends keyof T
    ? { [P in K]: T[K] }
    : never
  : never;
export type TupleUnion<Arr extends any[]> = Arr extends [infer First, ...infer Rest] ? Union<First, TupleUnion<Rest>> : never;

/**
 * Equal to Omit<T, K>, but with constraint that `K` must be key of `T`.
 */
export type WithoutKey<T, K extends keyof T> = Omit<T, K>;

export type ArrayItem<Arr extends any[]> = Arr extends (infer T)[] ? T : never;
export type Promisefy<T> = T extends Promise<any> ? T : Promise<T>;
export type UnPromisefy<T> = T extends Promise<infer R> ? R : T;

export type Callback<Params extends any[]> = (...args: Params) => void;
export type Func<Params extends any[], Result> = (
  ...args: Params
) => Result;
export type Mapper<In, Out> = (param: In) => Out;
export type Predicate<T> = Mapper<T, boolean>;
export type Method<This, Params extends any[], Result> = (
  this: This,
  ...args: Params
) => Result;

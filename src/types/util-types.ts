import { first } from "lodash";

export type Superior<A, B> = A extends B ? true : false;
export type Inferior<A, B> = Superior<B, A>;
export type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;
export type If<Cond extends boolean, A, B> = Cond extends true ? A : B;
export type IfNot<Cond extends boolean, A, B> = Cond extends false ? A : B;
export type IsRequired<T, K extends keyof T> = T extends Required<Pick<T, K>>
  ? true
  : false;
export type Compare<A, B> = A extends B
  ? B extends A
    ? "Equal"
    : "Inferior"
  : B extends A
  ? "Superior"
  : "None";
export type Union<A, B> = A | B;
export type Intersection<A, B> = A & B;
export type UnionToIntersection<U> = (
  U extends any ? (_: U) => void : never
) extends (_: infer T) => void
  ? T
  : never;

export type NotAny<Test, T> = If<Equal<Test, any>, never, T>;

export type NoAny<Tests extends any[], T> = If<
  Equal<ArrayItem<Tests>, any>,
  never,
  T
>;

export type KeyTypes = string | number | symbol;
export type PropertyKeys<T> = keyof T extends infer K
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
export type PropertyPart<T> = Pick<T, PropertyKeys<T>>;
export type MethodPart<T> = Pick<T, MethodKeys<T>>;
export type ConstructorOf<T, Params extends any[] = any[]> = {
  new (...args: Params): T;
};
export type ItemUnion<T> = keyof T extends infer K
  ? K extends keyof T
    ? Pick<T, K>
    : never
  : never;
export type ExactlyOne<U, T> = UnionToIntersection<
  U extends infer Item ? Equal<Item, T> : never
> extends true
  ? true
  : false;
export type PickOne<T, Picked> = ExactlyOne<ItemUnion<T>, Picked>;
export type TupleUnion<Arr extends any[] | readonly any[]> = Arr extends [
  infer First,
  ...infer Rest
]
  ? Union<First, TupleUnion<Rest>>
  : never;
export type MapTupleToPrimitives<
  Arr extends any[] | readonly any[]
> = Arr extends [] | readonly []
  ? []
  : Arr extends [infer First, ...infer Rest]
  ? [
      First extends PrimitiveTypes ? ToPrimitive<First> : First,
      ...MapTupleToPrimitives<Rest>
    ]
  : never;
export type TupleSlices<Arr extends any[] | readonly any[]> = Arr extends []
  ? []
  : Arr extends [infer First, ...infer Rest]
  ? [] | [First, ...TupleSlices<Rest>]
  : never;
export type TupleSlicesss<Arr extends any[] | readonly any[]> =
  | TupleSlices<Arr>
  | [];
/**
 * Equal to Omit<T, K>, but with constraint that `K` must be key of `T`.
 */
export type WithoutKey<T, K extends keyof T> = Omit<T, K>;

export type PrimitiveTypes =
  | string
  | number
  | boolean
  | undefined
  | null
  | symbol
  | bigint;

export type ToPrimitive<T extends PrimitiveTypes> = T extends null
  ? null
  : T extends undefined
  ? undefined
  : T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T extends symbol
  ? symbol
  : T extends bigint
  ? bigint
  : T;
export type DeepReadonly<T> = T extends PrimitiveTypes
  ? T
  : T extends any[]
  ? Readonly<ArrayItem<T>[]>
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };

export type Mutable<T> = T extends PrimitiveTypes
  ? ToPrimitive<T>
  : T extends [] | readonly []
  ? any[]
  : T extends any[] | readonly any[]
  ? Mutable<ArrayItem<T>>[]
  : { -readonly [K in keyof T]: Mutable<T[K]> };
export type ArrayItem<Arr extends any[] | readonly any[]> = Arr extends
  | (infer T)[]
  | readonly (infer T)[]
  ? T
  : never;
export type Promisefy<T> = T extends Promise<any> ? T : Promise<T>;
export type UnPromisefy<T> = T extends Promise<infer R> ? UnPromisefy<R> : T;

export type Callback<Params extends any[]> = (...args: Params) => void;
export type Func<Params extends any[], Result> = (...args: Params) => Result;
export type Mapper<In, Out> = (param: In) => Out;
export type Predicate<T> = Mapper<T, boolean>;
export type Method<This, Params extends any[], Result> = (
  this: This,
  ...args: Params
) => Result;
export type MethodsOf<T> = {
  [K in MethodKeys<T>]: Method<T, Parameters<T[K]>, ReturnType<T[K]>>;
};

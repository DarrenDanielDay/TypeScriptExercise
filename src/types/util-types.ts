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
  U extends unknown ? (_: U) => void : never
) extends (_: infer T) => void
  ? T
  : never;

export type AnyArray = readonly unknown[];
export type EmptyTuple = readonly [];
export type SaferAny = Record<KeyTypes, unknown>;
export type NotAny<Test, T> = If<Equal<Test, any>, never, T>;

export type NoAny<Tests extends AnyArray, T> = If<
  Equal<ArrayItem<Tests>, any>,
  never,
  T
>;

export type KeyTypes = string | number | symbol;
export type SelectKey<Union extends string, K extends Union> = K;
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
export type ConstructorOf<T, Params extends AnyArray = AnyArray> = {
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
export type TupleHead<Tuple extends AnyArray> = Tuple extends [
  infer First,
  ...AnyArray
]
  ? First
  : never;
export type TupleTail<Tuple extends AnyArray> = Tuple extends [
  unknown,
  ...infer Tail
]
  ? Tail
  : never;
export type TupleUnion<Arr extends AnyArray> = Arr extends [
  infer First,
  ...infer Rest
]
  ? Union<First, TupleUnion<Rest>>
  : never;
export type MapTupleToPrimitives<Arr extends AnyArray> = Arr extends EmptyTuple
  ? EmptyTuple
  : Arr extends [infer First, ...infer Rest]
  ? [
      First extends PrimitiveTypes ? ToPrimitive<First> : First,
      ...MapTupleToPrimitives<Rest>
    ]
  : never;
export type TupleSlices<Arr extends AnyArray> = Arr extends EmptyTuple
  ? []
  : Arr extends readonly [infer First, ...infer Rest]
  ? [] | [First, ...TupleSlices<Rest>]
  : never;

export type WithoutKey<T, K extends keyof T> = Omit<T, K>;

export type PrimitiveTypes =
  | string
  | number
  | boolean
  | undefined
  | null
  | symbol
  | bigint;
export type Nullish = undefined | null;
export interface PrimitiveTypeMapping {
  string: string;
  number: number;
  boolean: boolean;
  undefined: undefined;
  null: null;
  symbol: symbol;
  bigint: bigint;
}
export interface TypeofMapping
  extends WithoutKey<PrimitiveTypeMapping, "null"> {
  function: Function;
  object: object;
}
export type GeneralObject = Record<string | symbol, unknown>;
export type TypicalObject = Record<string, unknown>;
export type JSTypes = keyof TypeofMapping;
export type TypeToJSTypes<T extends PrimitiveTypes | object> = {
  [K in JSTypes]: T extends TypeofMapping[K] ? K : never;
}[JSTypes];
export type GeneralTypes = JSTypes | keyof PrimitiveTypeMapping;

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
  : T extends AnyArray
  ? Readonly<T>
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };

export type Mutable<T> = T extends PrimitiveTypes
  ? ToPrimitive<T>
  : T extends EmptyTuple
  ? unknown[]
  : T extends AnyArray
  ? Mutable<ArrayItem<T>>[]
  : { -readonly [K in keyof T]: Mutable<T[K]> };

export type DeepPartial<T> = T extends PrimitiveTypes | AnyArray
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };

export type ArrayItem<Arr extends AnyArray> = Arr extends readonly (infer T)[]
  ? T
  : never;
export type Promisefy<T> = T extends Promise<unknown> ? T : Promise<T>;
export type UnPromisefy<T> = T extends Promise<infer R> ? UnPromisefy<R> : T;

export type Callback<Params extends AnyArray> = (...args: Params) => void;
export type Func<Params extends AnyArray, Result> = (...args: Params) => Result;
export type TypeGuard<Union, SubSet extends Union> = (
  obj: Union
) => obj is SubSet;
export type Mapper<In, Out> = (param: In) => Out;
export type Predicate<T> = Mapper<T, boolean>;
export type Method<This, Params extends AnyArray, Result> = (
  this: This,
  ...args: Params
) => Result;
export type MethodsOf<T> = {
  [K in MethodKeys<T>]: Method<T, Parameters<T[K]>, ReturnType<T[K]>>;
};
export type Getter<This, T> = Method<This, [], T>;
export type Setter<This, T> = Method<This, [T], void>;
export type BindedGetter<This, K extends keyof This> = Getter<This, This[K]>;
export type BindedSetter<This, K extends keyof This> = Setter<This, This[K]>;

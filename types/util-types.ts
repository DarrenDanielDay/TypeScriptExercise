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

export type ArrayItem<Arr extends any[]> = Arr extends (infer T)[] ? T : never;
export type Promisefy<T> = T extends Promise<any> ? T : Promise<T>;
export type UnPromisefy<T> = T extends Promise<infer R> ? R : T;

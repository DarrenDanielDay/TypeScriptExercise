export type Superior<A, B> = A extends B ? true : false;
export type Inferior<A, B> = Superior<B, A>;
export type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;
export type Union<A, B> = A | B;
export type Intersection<A, B> = A & B;

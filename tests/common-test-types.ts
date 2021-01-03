export interface FatherInterface {
  father: number;
}

export interface SonInterface extends FatherInterface {
  son: string;
}

export class FatherClass implements FatherInterface {
  father: number;
  fatherMethod(fatherParam: number) {}
}

export class SonClass extends FatherClass implements SonInterface {
  son: string;
  sonMethod(sonParam: string) {}
}

export type StringUnion = "foo" | "bar" | "baz";

export enum Enum {
  Foo,
  Bar,
  Baz,
}

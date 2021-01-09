import { Mixins } from "../../src/interfaces";

declare global {
  function range(end: number): Iterable<number>;
  function range(begin: number, end: number): Iterable<number>;
  function range(begin: number, end: number, step: number): Iterable<number>;
}

export const injector: Mixins.IGlobalMixin;

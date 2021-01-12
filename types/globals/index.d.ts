import { Mixins } from "../../src/interfaces";

declare global {
  function range(end: number): QuerySequence<number>;
  function range(begin: number, end: number): QuerySequence<number>;
  function range(
    begin: number,
    end: number,
    step: number
  ): QuerySequence<number>;
}

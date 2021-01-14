# Global variable injection

```ts
import { Linq } from "../../extensions";
import { Mixins } from "../../interfaces";
// Global declaration to give the name.
declare global {
  function range(end: number): Linq.QuerySequence<number>;
  function range(begin: number, end: number): Linq.QuerySequence<number>;
  function range(
    begin: number,
    end: number,
    step: number
  ): Linq.QuerySequence<number>;
}
// Use the tool method.
export const rangeMixin = makeGlobalMixinManager({
  range(a: number, b?: number, c?: number) {
    return new Linq.QuerySequence(range(a, b, c));
  },
});
```

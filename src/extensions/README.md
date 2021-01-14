# Extension method injection

The `extension` here refers to the methods and properties which are injected by modifying the `prototype` of a constructor.

Extendsions are recommended to be implemented like this (see [/src/extensions/string/index.ts](./string/index.ts)):

```ts
import { Extensions } from "../../interfaces";
import { makeMethodExtension } from "../../interfaces/extensions";
import { UtilTypes } from "../../types";
// Use `declare global` to mix into the global namespace or the target namespace.
declare global {
  interface String {
    forEach(callback: UtilTypes.Callback<[string]>): void;
  }
}
// Just use the helper function to get perfect hint!
export const StringExtension: Extensions.IExtension<string> = makeMethodExtension<String>(
  String,
  {
    forEach(callback) {
      for (const character of this) {
        callback(character);
      }
    },
    valueOf() {
      // This is the issue of typescript, without `valueOf`, the extension method of String will always have a type error.
      return String.prototype.valueOf.call(this, arguments);
    },
  },
  "string-foreach-ext"
);
```

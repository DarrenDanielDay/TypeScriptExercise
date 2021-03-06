import { Extensions } from "../../interfaces";
import { makeMethodExtension } from "../../interfaces/extensions";
import { Callback } from "../../types/util-types";

declare global {
  interface String {
    forEach(callback: Callback<[string]>): void;
  }
}

export const StringExtension: Extensions.IExtension<String> = makeMethodExtension<String>(
  String,
  {
    forEach(callback) {
      for (const character of this) {
        callback(character);
      }
    },
    valueOf() {
      return String.prototype.valueOf.apply(this, (arguments as unknown) as []);
    },
  },
  "string-foreach-ext"
);

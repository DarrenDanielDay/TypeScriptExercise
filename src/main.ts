import { LinqExtension } from "./extensions/linq";
import axios from "axios";
import { StringExtension } from "./extensions/string";
import { rangeMixin } from "./globals/builtins/range";
import { useGlobalMixins } from "./interfaces/mixins";
import { HubSwitch } from "./utils/design-patterns";
const globalContext = useGlobalMixins([rangeMixin]);
globalContext.switchOn();
new HubSwitch(
  [StringExtension, LinqExtension],
  "install",
  "uninstall",
  [],
  []
).withSwitchOnScope(() => {
  const result = range(10, 40, 2);
  console.log(result);
  result
    .where((i) => i % 3 === 0)
    .toList()
    .forEach(console.log);
  "abc".forEach(console.log);
});

try {
  "abc".forEach(console.log);
} catch (e) {
  console.log("Cannot use extension method when it's not installed.");
  console.log(e);
}

StringExtension.install();
"abc".forEach(console.log);
StringExtension.uninstall();

// The typescript syntax
let message: string = "TypeScript Exercise";
console.log(`Hello, ${message}!`);

// Use third-party library
axios.get("https://www.baidu.com").then((v) => {
  console.log(v.data);
});
globalContext.switchOff();

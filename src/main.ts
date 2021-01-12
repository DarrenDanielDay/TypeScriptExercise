import { LinqExtension } from "./extensions/linq";
import axios from "axios";
import { pick } from "./utils/object-operations";
import { StringExtension } from "./extensions/string";
import { ExtensionInstaller } from "./extensions";
import { rangeMixin } from "./globals/builtins/range";
import { GlobalMixinManager } from "./globals";
const manager = new GlobalMixinManager(rangeMixin);
manager.inject();
new ExtensionInstaller([StringExtension, LinqExtension]).useScoped(() => {
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

const foo = pick({ a: 1 }, "a");
// The typescript syntax
let message: string = "TypeScript Exercise";
console.log(`Hello, ${message}!`);

// Use third-party library
axios.get("https://www.baidu.com").then((v) => {
  console.log(v.data);
});
manager.remove();

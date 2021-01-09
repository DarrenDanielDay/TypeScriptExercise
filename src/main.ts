// import './utils/linq'
import { LinqExtension } from "./extensions/linq";
import { injector } from "./globals";
import axios from "axios";
import { pick } from "./utils/object-operations";
import { StringExtension } from "./extensions/string";
import { ExtensionInstaller } from "./extensions";
import { rangeMixin } from "./globals/builtins/range";
injector([rangeMixin]);
new ExtensionInstaller([StringExtension, LinqExtension]).useScoped(() => {
  const result = [...range(10, 40, 2)];
  console.log(result);
  // where(i => i % 3 === 0).toList().forEach(console.log)
});
LinqExtension.install();
StringExtension.install();
// const result = [...range(3)].select((i) => i.toFixed(2));
// for (let i of result) {
//   console.log(i);
// }
const foo = pick({ a: 1 }, "a");
let message: string = "TypeScript Exercise";
axios.get("https://www.baidu.com").then((v) => {
  console.log(v.data);
});
"abc".forEach(console.log);
console.log(`Hello, ${message}!`);
LinqExtension.uninstall();
StringExtension.uninstall();

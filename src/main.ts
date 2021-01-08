// import './utils/linq'
import { LinqExtension } from "./extensions/linq";
import axios from "axios";
import { pick } from "./utils/object-operations";

LinqExtension.install();

const result = [1].select((i) => i.toFixed(2));
for (let i of result) {
  console.log(i);
}
const foo = pick({ a: 1 }, "a");
let message: string = "TypeScript Exercise";
message;
axios.get("https://www.baidu.com").then((v) => {
  console.log(v.data);
});

console.log(`Hello, ${message}!`);
let a: GT = 2;
LinqExtension.uninstall();

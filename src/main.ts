import { LinqExtension } from "./extensions/linq";
import axios from "axios";
import { StringExtension } from "./extensions/string";
import { rangeMixin } from "./globals/builtins/range";
import { useGlobalMixins } from "./interfaces/mixins";
import { HubSwitch } from "./utils/design-patterns";
import { withContext } from "./interfaces/decorators";
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
axios.get("https://www.baidu.com");
globalContext.switchOff();

// Decorator utils:

class BaseClass {
  static common() {
    console.log("common");
  }
}

const counter: Record<string, number> = {};
const MyDecorator = withContext(counter)
  .withClass(BaseClass)
  .createDecorators({
    // custom names for decorator
    CountIt: {
      // type can be parameter, property, getter, setter, method, class
      type: "method",
      hooks: {
        onDecorate({ keyInfo }) {
          console.log("CountIt now decorated on", keyInfo.key);
        },
        wrapper({ context, keyInfo, originalFunc, runtimeArgs }) {
          // context is just the given context object
          // use a common `context` to manage your decorators
          context[keyInfo.key as string] =
            (context[keyInfo.key as string] ?? 0) + 1;
          // invoke the original function
          // `this` context is the instance.
          return originalFunc.apply(this, runtimeArgs);
        },
      },
    },
    DecorateClass: {
      type: "class",
      hooks: {
        onDecorate({ classObject }) {
          // classObject is infered as typeof BaseClass!
          console.log("DecorateClass decorates", classObject.name);
          classObject.common();
        },
      },
    },
  });

@MyDecorator.DecorateClass
class CustomClass extends BaseClass {
  @MyDecorator.CountIt
  methodA() {
    console.log("call method A");
  }
  @MyDecorator.CountIt
  methodB() {
    console.log("call method B");
  }
}

const instance = new CustomClass();

instance.methodA();
instance.methodA();
instance.methodB();
instance.methodB();
instance.methodB();
instance.methodA();
instance.methodA();

console.log(counter);

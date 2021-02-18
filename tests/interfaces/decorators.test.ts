import { logger, parameters } from "../../src/decorators";

function n(...args: unknown[]) {
  [...args];
}
const key = "someKey".split("").join("");

@parameters.AllChecked
class A {
  @parameters.Checked
  @logger.log
  method(@parameters.NotNull param: unknown) {
    console.log(param);
  }
  @n
  get getter() {
    return 1;
  }

  @n
  set setter(value: number) {
    console.log("set", value);
  }

  @n
  [key]() {}

  @n
  public undefinedProp?: number;
  @n
  public definedProp: number = 1;
}

new A().method(null);

console.log(new A().undefinedProp);
console.log((new A().undefinedProp = 2));

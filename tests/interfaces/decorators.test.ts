import { Internal } from "../../src";
import { logger, parameters } from "../../src/decorators";
import { consoleMock } from "../../src/globals/mocks/console";
import { RuntimeCheck } from "../__utils__";
consoleMock.inject();
function n(...args: unknown[]) {
  [...args];
}
const key = "someKey".split("").join("");

@parameters.AllChecked
class A {
  @parameters.Checked
  @logger.log
  method(@parameters.NotNull param: unknown) {
    Internal.info("call method", param);
  }
  @n
  get getter() {
    return 1;
  }

  @n
  set setter(value: number) {
    Internal.info("set", value);
  }

  @n
  [key]() {}

  @n
  public undefinedProp?: number;
  @n
  public definedProp: number = 1;
}

RuntimeCheck.assertEqual(new A().undefinedProp, undefined);
const a = new A();
RuntimeCheck.assertThrows(a.method.bind(a), null);
RuntimeCheck.assertNoException(a.method.bind(a), 1);
a.undefinedProp = 2;
RuntimeCheck.assertEqual(a.undefinedProp, 2);
consoleMock.remove();

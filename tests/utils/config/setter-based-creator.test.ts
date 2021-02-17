import { createConfig } from "../../../src/utils/config/setter-based-creator";
import { withConstraints } from "../../../src/utils/config/common";
import { assertEqual } from "../../__utils__/runtime-check-utils";
import { pickEnumerableStringKey } from "../../../src/utils/function-tools/pick";
const originalConfig = { a: "a" };
const config = createConfig(
  originalConfig,
  withConstraints<{ a: "a" | "A" }>()
);
assertEqual(pickEnumerableStringKey(config), originalConfig);
assertEqual(
  pickEnumerableStringKey(config.setA("A")) as typeof originalConfig,
  { a: "A" }
);

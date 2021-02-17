import { DeepReadonly } from "../../../src/types/util-types";
import {
  $change,
  createConfig,
} from "../../../src/utils/config/symbol-based-creator";
import { withConstraints } from "../../../src/utils/config/common";
import { pickEnumerableStringKey } from "../../../src/utils/function-tools/pick";
import { assertEqual } from "../../__utils__/runtime-check-utils";

interface Test {
  aaa: number;
  bbb: string;
}
const config = createConfig(
  { a: { aaa: 1, bbb: "b" }, b: 2 },
  withConstraints<{ a: Test; b: 1 | 2 | 3 }>()
);
const changedConfig = config[$change]("a", { aaa: 666, bbb: "BBB" } as const)
  [$change]("b", 1 as const)
  [$change]("b", 2 as const);
const pickedConfig = pickEnumerableStringKey(changedConfig);
assertEqual(pickedConfig as DeepReadonly<typeof pickedConfig>, {
  a: { aaa: 666, bbb: "BBB" },
  b: 2,
});

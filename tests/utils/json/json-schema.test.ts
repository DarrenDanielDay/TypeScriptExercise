import {
  HintSchemaItem,
  validateJSON,
} from "../../../src/utils/json/json-schema";
import { assertEqual } from "../../__utils__/runtime-check-utils";

const foo: HintSchemaItem<{
  a: { s: string }[];
  b: { c: { d: number; e: string } };
}> = {
  type: "object",
  childrenSchema: {
    a: {
      type: "array",
      required: false,
      validator(arr) {
        return (arr?.length ?? 0) <= 2;
      },
      itemSchema: {
        type: "object",
        childrenSchema: {
          s: {
            type: "string",
            required: true,
          },
        },
      },
    },
    b: {
      type: "object",
      childrenSchema: {
        c: {
          type: "object",
          childrenSchema: {
            d: {
              type: "number",
            },
            e: {
              type: "string",
              required: true,
              validator(item) {
                return item?.startsWith("e")!;
              },
            },
          },
        },
      },
    },
  },
};

assertEqual(
  validateJSON({
    json: { a: [{ s: "sss" }], b: { c: { d: 1, e: "eee" } } },
    schema: foo,
  }),
  true
);
assertEqual(
  validateJSON({
    json: {
      a: [{ s: "sss" }, ({ ss: "" } as unknown) as { s: string }],
      b: { c: { d: 1, e: "eee" } },
    },
    schema: foo,
  }),
  false
);
assertEqual(
  validateJSON({
    json: { a: [{ s: "sss" }], b: { c: { d: 1, e: "fff" } } },
    schema: foo,
  }),
  false
);
assertEqual(
  validateJSON({
    json: { a: [{ s: "sss" }, { s: "sss" }], b: { c: { d: 1, e: "eee" } } },
    schema: foo,
  }),
  true
);
assertEqual(
  validateJSON({
    json: {
      a: [{ s: "sss" }, { s: "sss" }, { s: "sss" }],
      b: { c: { d: 1, e: "eee" } },
    },
    schema: foo,
  }),
  false
);
assertEqual(
  validateJSON({
    json: { a: (null as unknown) as [], b: { c: { d: 1, e: "eee" } } },
    schema: foo,
  }),
  true
);

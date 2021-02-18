import { UtilTypes } from "../../src/types";
import { CommonTestTypes, CommonTestUtil, StaticTypeCheck } from "../__utils__";
import { getType } from "../__utils__/test-utils";

StaticTypeCheck.assertExpressionAssignable<UtilTypes.ItemUnion<{ a: 1; b: 2 }>>(
  { a: 1 }
);
StaticTypeCheck.assertExpressionAssignable<UtilTypes.ItemUnion<{ a: 1; b: 2 }>>(
  { b: 2 }
);
StaticTypeCheck.assertExpressionAssignable<UtilTypes.ItemUnion<{ a: 1; b: 2 }>>(
  CommonTestUtil.getType<{ a: 1 } | { b: 2 }>()
);
StaticTypeCheck.assertThat<
  UtilTypes.ExactlyOne<{ a: 1 } | { b: 2 }, { a: 1 }>
>();
StaticTypeCheck.assertThat<
  UtilTypes.ExactlyOne<{ a: 1 } | { b: 2 }, { b: 2 }>
>();
StaticTypeCheck.assertNotThat<
  UtilTypes.ExactlyOne<{ a: 1 } | { b: 2 }, { b: 1 }>
>();
StaticTypeCheck.assertNotThat<
  UtilTypes.ExactlyOne<UtilTypes.ItemUnion<CommonTestTypes.Foo>, { a: 1 }>
>();
StaticTypeCheck.assertThat<
  UtilTypes.ExactlyOne<UtilTypes.ItemUnion<CommonTestTypes.Foo>, { a: string }>
>();
StaticTypeCheck.assertThat<
  UtilTypes.ExactlyOne<UtilTypes.ItemUnion<CommonTestTypes.Foo>, { b: number }>
>();
type fooOnePiece = UtilTypes.ItemUnion<CommonTestTypes.Foo>;
StaticTypeCheck.assertExpressionAssignable<fooOnePiece>({ a: "" });
StaticTypeCheck.assertExpressionAssignable<fooOnePiece>({ b: 1 });
StaticTypeCheck.assertExpressionAssignable<fooOnePiece>({});
StaticTypeCheck.assertExpressionAssignable<fooOnePiece>({ prop: { c: [] } });
StaticTypeCheck.assertExpressionAssignable<fooOnePiece>({
  prop: { c: [], d: getType<Promise<number>>() },
});
StaticTypeCheck.assertThat<
  UtilTypes.ExactlyOne<
    UtilTypes.ItemUnion<CommonTestTypes.Foo>,
    {
      prop?: {
        c: string[];
        d?: Promise<number>;
      };
    }
  >
>();

function foo<T, P extends Partial<T>>(
  item: T,
  part: P
): UtilTypes.PickOne<T, P> {
  return (!!item && !!part) as never;
}
StaticTypeCheck.assertThat<
  UtilTypes.PickOne<
    CommonTestTypes.Foo,
    {
      a: string;
    }
  >
>();
StaticTypeCheck.assertExpressionAssignable<true>(foo({ a: 1, b: 2 }, { a: 1 }));

const constObject = {
  a: [1, ""],
  b: "asdf",
  c: {
    d: 123,
    e: {
      f: [],
    },
  },
} as const;
type constObjectT = typeof constObject;
StaticTypeCheck.assertCompare<
  UtilTypes.DeepReadonly<{
    a: (string | number)[];
    b: string;
    c: { d: number; e: { f: number[] } };
  }>,
  constObjectT
>("Superior");
StaticTypeCheck.assertCompare<
  UtilTypes.DeepReadonly<constObjectT>,
  {
    readonly a: readonly [1, ""];
    readonly b: "asdf";
    readonly c: {
      readonly d: 123;
      readonly e: {
        readonly f: readonly [];
      };
    };
  }
>("Equal");
type MT = UtilTypes.Mutable<constObjectT>;
StaticTypeCheck.assertCompare<
  MT,
  {
    a: (string | number)[];
    b: string;
    c: {
      d: number;
      e: {
        f: unknown[];
      };
    };
  }
>("Equal");
StaticTypeCheck.assertCompare<UtilTypes.Mutable<string>, string>("Equal");
StaticTypeCheck.assertCompare<UtilTypes.Mutable<number>, number>("Equal");
StaticTypeCheck.assertCompare<UtilTypes.Mutable<null>, null>("Equal");
StaticTypeCheck.assertCompare<UtilTypes.Mutable<string>, string>("Equal");
StaticTypeCheck.assertCompare<UtilTypes.Mutable<readonly []>, unknown[]>(
  "Equal"
);
StaticTypeCheck.assertCompare<UtilTypes.Mutable<[]>, unknown[]>("Equal");
StaticTypeCheck.assertCompare<UtilTypes.Mutable<readonly [1]>, number[]>(
  "Equal"
);

type tuples = UtilTypes.TupleSlices<[string, number]>;
StaticTypeCheck.assertExpressionAssignable<tuples>([""]);
StaticTypeCheck.assertExpressionAssignable<tuples>(["", 1]);

function partialParams<P extends tuples>(...args: P) {
  [...args];
}

partialParams("");
partialParams("", 1);

function withEmpty(...args: UtilTypes.TupleSlices<[string, number]>) {
  [...args];
}
// No hint in vscode.
withEmpty();
withEmpty("");
withEmpty("", 1);

StaticTypeCheck.assertCompare<UtilTypes.NotAny<number, string>, string>(
  "Equal"
);
StaticTypeCheck.assertIsNever<UtilTypes.NotAny<any, string>>();
StaticTypeCheck.assertIsNever<UtilTypes.NotAny<any, any>>();
StaticTypeCheck.assertIsNever<UtilTypes.NoAny<any, any>>();
StaticTypeCheck.assertIsNever<UtilTypes.NoAny<[number, any], number>>();
StaticTypeCheck.assertCompare<UtilTypes.NoAny<[number], number>, number>(
  "Equal"
);

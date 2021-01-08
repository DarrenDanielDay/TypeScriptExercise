import { UtilTypes } from "../../src/types";
import { Equal } from "../../src/types/util-types";
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
  return null as any;
}
type bar = UtilTypes.PickOne<
  CommonTestTypes.Foo,
  {
    a: string;
  }
>;
// StaticTypeCheck.assertThat<>();
const result = foo({ a: 1, b: 2 }, { a: 1 });
type E = UtilTypes.UnionToIntersection<
  Equal<{ a: 1 }, { a: 1 }> | Equal<{ b: 1 }, { a: 1 }>
>;

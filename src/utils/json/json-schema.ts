import {
  AnyArray,
  ArrayItem,
  GeneralTypes,
  SelectKey,
} from "../../types/util-types";

export interface Property<Name extends string, Type> {
  name: Name;
  type: Type;
}
export type JSONPrimitiveTypes = number | string | boolean | null;
/**
 * Judge whether the object can be an item of JSON. `undefined` is reguarded as `null`.
 * @param obj the js object
 */
export const isJSONPrimitive = (
  obj: unknown
): obj is JSONPrimitiveTypes | undefined =>
  obj == null || ["number", "string", "boolean"].includes(typeof obj);
type SchemaItem<T> =
  | NumberSchemaItem
  | StringSchemaItem
  | BooleanSchemaItem
  | NullSchemaItem
  | ArraySchemaItem<T>
  | ObjectSchemaItem<T>;

export type HintSchemaItem<T> = T extends JSONPrimitiveTypes
  ? HintPrimitiveSchema<T>
  : T extends AnyArray
  ? HintArraySchemaItem<T>
  : T extends object
  ? HintObjectSchemaItem<T>
  : never;

export type JSONItemType =
  | SelectKey<GeneralTypes, "number" | "string" | "boolean" | "null" | "object">
  | "array";

export interface BaseSchemaItem<T> {
  type: JSONItemType;
  required?: boolean;
  validator?: (this: undefined, item?: T) => boolean;
}
export interface JSONTypeMapping {
  number: number;
  string: string;
  boolean: boolean;
  null: null;
  object: object;
  array: AnyArray;
}
export type TypeToJSONItemType<T extends JSONPrimitiveTypes> = {
  [K in JSONItemType]: T extends JSONTypeMapping[K] ? K : never;
}[JSONItemType];

export interface PrimitiveSchemaItem<T extends JSONPrimitiveTypes>
  extends BaseSchemaItem<T> {
  type: TypeToJSONItemType<T>;
}

type HintPrimitiveSchema<T extends JSONPrimitiveTypes> = {
  type: TypeToJSONItemType<T>;
} & BaseSchemaItem<T>;

export interface NumberSchemaItem extends PrimitiveSchemaItem<number> {
  type: "number";
}

export interface StringSchemaItem extends PrimitiveSchemaItem<string> {
  type: "string";
}

export interface BooleanSchemaItem extends PrimitiveSchemaItem<boolean> {
  type: "boolean";
}

export interface NullSchemaItem extends PrimitiveSchemaItem<null> {
  type: "null";
}

export interface ArraySchemaItem<T> extends BaseSchemaItem<T> {
  type: "array";
  itemSchema?: T extends AnyArray ? SchemaItem<ArrayItem<T>> : never;
}

type HintArraySchemaItem<T extends AnyArray> = BaseSchemaItem<T> & {
  type: "array";
  itemSchema?: HintSchemaItem<ArrayItem<T>>;
};

export interface ObjectSchemaItem<T> extends BaseSchemaItem<T> {
  type: "object";
  childrenSchema?: {
    [K in keyof T]: SchemaItem<T[K]>;
  };
}

type HintObjectSchemaItem<T extends object> = BaseSchemaItem<T> & {
  type: "object";
  childrenSchema?: {
    [K in keyof T]: HintSchemaItem<T[K]>;
  };
};

export function validateJSON<T>(params: {
  json: T;
  schema: HintSchemaItem<T>;
}): boolean {
  const { schema, json }: { schema: SchemaItem<T>; json: T } = params as never;
  if (schema.required === false && json == null) return true;
  // When required
  if (schema.validator) {
    if (!(schema as BaseSchemaItem<T>).validator!.call(undefined, json)) {
      return false;
    }
  }
  if (schema.type === "object") {
    if (typeof json !== "object") return false;
    const { childrenSchema } = schema;
    if (!childrenSchema) return true;
    for (const key in childrenSchema) {
      const childSchema = childrenSchema[key];
      if (!validateJSON({ json: json[key], schema: childSchema } as never)) {
        return false;
      }
    }
    return true;
  }
  if (schema.type === "array") {
    if (!Array.isArray(json)) return false;
    const { itemSchema } = schema;
    if (!itemSchema) return true;
    return json.every((value) =>
      validateJSON({ json: value, schema: itemSchema } as never)
    );
  }
  if (schema.type === "null") {
    return json === null;
  }
  if (schema.type !== typeof json) {
    return false;
  }
  return true;
}

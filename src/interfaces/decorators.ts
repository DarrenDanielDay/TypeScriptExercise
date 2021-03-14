import { Internal } from "..";
import { AnyArray, Method } from "../types/util-types";
import { pickKey } from "../utils/function-tools/pick";
import { isFunction } from "../utils/function-tools/type-guards";

export interface DecoratorGroup {
  parameter: ParameterDecorator;
  property: PropertyDecorator;
  method: MethodDecorator;
  getter: MethodDecorator;
  setter: MethodDecorator;
  class: ClassDecorator;
}

const creatorMapping = {
  parameter: createParameterDecorator,
  property: createPropertyDecorator,
  method: createMethodDecorator,
  getter: createGetterDecorator,
  setter: createSetterDecorator,
  class: createClassDecorator,
};

interface DecoratorHooksMapping<
  Context extends object,
  Class extends Function,
  This = Class["prototype"],
  Proto = This
> {
  parameter: ParameterDecoratorHooks<Context, Proto>;
  property: PropertyDecoratorHooks<Context, unknown, This, Proto>;
  method: MethodBasedDecoratorHooks<Context, unknown[], unknown, This, Proto>;
  getter: MethodBasedDecoratorHooks<Context, unknown[], unknown, This, Proto>;
  setter: MethodBasedDecoratorHooks<Context, unknown[], unknown, This, Proto>;
  class: ClassDecoratorHooks<Context, Class>;
}

type DecoratorItem<
  Type extends DecoratorTypes,
  Context extends object,
  Class extends Function
> = Type extends DecoratorTypes
  ? {
      type: Type;
      hooks: DecoratorHooksMapping<Context, Class>[Type];
    }
  : never;

export class DecoratorBuilder<
  Context extends object,
  Class extends Function = Function
> {
  constructor(
    public context: Context,
    public classObject: Class = Function as never
  ) {}

  createDecorators<
    T extends Record<string, DecoratorItem<DecoratorTypes, Context, Class>>
  >(decorators: T) {
    return Object.entries(decorators).reduce<Record<string, unknown>>(
      (prev, [key, value]) => {
        prev[key] = (creatorMapping[value.type] as Function)(
          this.context,
          value.hooks
        );
        return prev;
      },
      Object.create(null)
    ) as {
      [K in keyof T]: DecoratorGroup[T[K]["type"]];
    };
  }
  withClass<RClass extends Function>(classObject: RClass) {
    const that = (this as unknown) as DecoratorBuilder<Context, RClass>;
    that.classObject = classObject;
    return that;
  }
  withContext<RContext extends object>(context: RContext) {
    const that = (this as unknown) as DecoratorBuilder<RContext, Class>;
    that.context = context;
    return that;
  }
}

export function withContext<Context extends object>(
  context: Context
): DecoratorBuilder<Context, Function> {
  return new DecoratorBuilder(context, Function);
}

export type DecoratorTypes = keyof DecoratorGroup;

export interface ParameterDecoratorHooks<
  Context extends object,
  Proto = Object
> {
  onDecorate?({
    context,
    paramInfo,
  }: {
    context: Context;
    paramInfo: ParameterInfo<Proto>;
  }): void;
}

export interface MethodBasedDecoratorHooks<
  Context extends object,
  Params extends AnyArray,
  Result,
  This = Object,
  Proto = This
> {
  onDecorate?({
    context,
    keyInfo,
  }: {
    context: Context;
    keyInfo: KeyInfo<Proto>;
  }): void;
  wrapper?(
    this: This,
    {
      originalFunc,
      runtimeArgs,
      keyInfo,
      context,
    }: {
      originalFunc: Method<This, Params, Result>;
      runtimeArgs: Params;
      keyInfo: KeyInfo<Proto>;
      context: Context;
    }
  ): Result;
}

export interface PropertyDecoratorHooks<
  Context extends object,
  T,
  This = Object,
  Proto = This
> {
  onDecorate?({
    context,
    keyInfo,
  }: {
    context: Context;
    keyInfo: KeyInfo<Proto>;
  }): void;
  getter?(this: This, {}: { context: Context; keyInfo: KeyInfo<Proto> }): T;
  setter?(
    this: This,
    {
      value,
      context,
      keyInfo,
    }: { value: T; context: Context; keyInfo: KeyInfo<Proto> }
  ): void;
}

export interface ClassDecoratorHooks<Context extends object, Class = Function> {
  onDecorate?({
    context,
    classObject,
  }: {
    context: Context;
    classObject: Class;
  }): void;
  rewrite?({
    context,
    classObject,
  }: {
    classObject: Class;
    context: Context;
  }): Class;
}

export interface KeyInfo<Proto = Object> {
  readonly prototype: Proto;
  readonly key: string | symbol;
}

export interface ParameterInfo<Proto = Object> extends KeyInfo<Proto> {
  readonly index: number;
}

export function createParameterDecorator<
  Context extends object,
  Proto = Object
>(context: Context, { onDecorate }: ParameterDecoratorHooks<Context, Proto>) {
  const decorator = function (
    prototype: Proto,
    methodKey: string | symbol,
    parameterIndex: number
  ) {
    onDecorate?.({
      context,
      paramInfo: createParameterInfo(
        createKeyInfo(prototype, methodKey),
        parameterIndex
      ),
    });
  } as ParameterDecorator;
  return decorator;
}

function createKeyInfo<Proto = Object>(
  prototype: Proto,
  methodKey: string | symbol
) {
  const keyInfo: KeyInfo<Proto> = Object.create(null);
  Object.defineProperties(keyInfo, {
    [pickKey<KeyInfo>("key")]: {
      value: methodKey,
    },
    [pickKey<KeyInfo>("prototype")]: {
      value: prototype,
    },
  });
  return keyInfo;
}

function createParameterInfo<Proto = Object>(
  keyInfo: KeyInfo<Proto>,
  index: number
) {
  const parameterInfo = keyInfo as ParameterInfo<Proto>;
  Object.defineProperties(parameterInfo, {
    [pickKey<ParameterInfo>("index")]: {
      value: index,
    },
  });
  return parameterInfo;
}

const isMethod = <This, Params extends AnyArray, Result>(
  fn: Function
): fn is Method<This, Params, Result> => isFunction(fn);

function createMethodBasedDecorator<
  Context extends object,
  Params extends AnyArray,
  Result,
  This = Object,
  Proto = This
>(
  {
    onDecorate,
    wrapper,
  }: MethodBasedDecoratorHooks<Context, Params, Result, This, Proto>,
  type: "get" | "set" | "value",
  context: Context
): MethodDecorator {
  const decorator = function (
    prototype: Proto,
    methodKey: string | symbol,
    descriptor: TypedPropertyDescriptor<Method<This, Params, Result>>
  ) {
    const originalFunc = descriptor?.[type];
    if (!originalFunc || !isMethod<This, Params, Result>(originalFunc)) {
      return Internal.error(
        "Invalid decorate target, target should be a function."
      );
    }
    const keyInfo = createKeyInfo<Proto>(prototype, methodKey);
    onDecorate?.call(undefined, { context, keyInfo });
    (descriptor[type] as Method<This, Params, Result>) = function (
      this: This,
      ...runtimeArgs: Params
    ) {
      if (wrapper) {
        return wrapper.call(this, {
          originalFunc,
          runtimeArgs,
          keyInfo,
          context,
        });
      }
      return originalFunc.call(this, ...runtimeArgs);
    };
    return descriptor;
  } as MethodDecorator;
  return decorator;
}

export function createMethodDecorator<
  Context extends object,
  Params extends AnyArray,
  Result,
  This = Object,
  Proto = This
>(
  context: Context,
  hooks: MethodBasedDecoratorHooks<Context, Params, Result, This, Proto>
) {
  return createMethodBasedDecorator(hooks, "value", context);
}

export function createGetterDecorator<
  Context extends object,
  Params extends AnyArray,
  Result,
  This = Object,
  Proto = This
>(
  context: Context,
  hooks: MethodBasedDecoratorHooks<Context, Params, Result, This, Proto>
) {
  return createMethodBasedDecorator(hooks, "get", context);
}

export function createSetterDecorator<
  Context extends object,
  Params extends AnyArray,
  Result,
  This = Object,
  Proto = This
>(
  context: Context,
  hooks: MethodBasedDecoratorHooks<Context, Params, Result, This, Proto>
) {
  return createMethodBasedDecorator(hooks, "set", context);
}

export function createPropertyDecorator<
  Context extends object,
  T,
  This = Object,
  Proto = This
>(
  context: Context,
  {
    getter,
    setter,
    onDecorate,
  }: PropertyDecoratorHooks<Context, T, This, Proto>
) {
  const decorator = function (target: Proto, key: string | symbol) {
    const keyInfo = createKeyInfo(target, key);
    onDecorate?.({ context, keyInfo });
    Object.defineProperty(target, key, {
      get(this: This) {
        return getter?.call(this, { context, keyInfo }) ?? null;
      },
      set(this: This, value: T) {
        return setter?.call(this, { value, context, keyInfo });
      },
    });
  } as PropertyDecorator;
  return decorator;
}

export function createClassDecorator<
  Context extends object,
  Class extends Function
>(
  context: Context,
  { onDecorate, rewrite }: ClassDecoratorHooks<Context, Class>
) {
  const decorator: ClassDecorator = function (classObject: Class) {
    onDecorate?.({ context, classObject });
    return rewrite?.({ classObject, context });
  } as never;
  return decorator;
}

export class DecoratorContext {
  private readonly tree: Map<
    object,
    {
      methods: Map<
        string | symbol,
        {
          parameters: Map<number, { decorators: Set<unknown> }>;
          decorators: Set<unknown>;
        }
      >;
      decorators: Set<unknown>;
    }
  > = new Map();
  classLevel(prototype: object) {
    if (!this.tree.has(prototype))
      this.tree.set(prototype, { methods: new Map(), decorators: new Set() });
    return this.tree.get(prototype)!;
  }
  class(prototype: object) {
    return this.classLevel(prototype);
  }
  methodLevel(prototype: object, key: string | symbol) {
    const classLevel = this.classLevel(prototype).methods;
    if (!classLevel.has(key))
      classLevel.set(key, { parameters: new Map(), decorators: new Set() });
    return classLevel.get(key)!;
  }
  method(keyInfo: KeyInfo) {
    return this.methodLevel(keyInfo.prototype, keyInfo.key);
  }
  parameterLevel(prototype: object, key: string | symbol, index: number) {
    const methodLevel = this.methodLevel(prototype, key).parameters;
    if (!methodLevel.has(index))
      methodLevel.set(index, { decorators: new Set() });
    return methodLevel.get(index)!;
  }
  parameter(parameterInfo: ParameterInfo) {
    return this.parameterLevel(
      parameterInfo.prototype,
      parameterInfo.key,
      parameterInfo.index
    );
  }
}

export const globalDecoratorContext = new DecoratorContext();

import { Internal } from "../..";
import {
  createClassDecorator,
  createMethodDecorator,
  createParameterDecorator,
} from "../../interfaces/decorators";
import { DecoratorContext } from "../../interfaces/decorators";

export const $parameters = Symbol.for("$parameters");
export const $NotNull = Symbol.for("$NotNull");
export const $Checked = Symbol.for("$Checked");
export const $AllChecked = Symbol.for("$AllChecked");

function onNullCheckFailed(
  classObject: Function,
  key: string | symbol,
  index: number
) {
  return Internal.error(
    `${
      classObject.name
    }.${key.toString()}  ${index}th parameter is undefined/null.`
  );
}

const ctx = new DecoratorContext();
export const parameters = {
  NotNull: createParameterDecorator(ctx, {
    onDecorate({ context, paramInfo }) {
      context.parameter(paramInfo).decorators.add($NotNull);
    },
  }),
  Checked: createMethodDecorator(ctx, {
    onDecorate({ context, keyInfo }) {
      context.method(keyInfo).decorators.add($Checked);
    },
    wrapper({ runtimeArgs, context, keyInfo, originalFunc }) {
      const map = context.method(keyInfo).parameters;
      map.forEach((value, key) => {
        if (value.decorators.has($NotNull)) {
          if (null == runtimeArgs[key]) {
            onNullCheckFailed(keyInfo.prototype.constructor, keyInfo.key, key);
          }
        }
      });
      return originalFunc.apply(this, runtimeArgs as unknown[]);
    },
  }),
  AllChecked: createClassDecorator(ctx, {
    onDecorate({ context, classObject }) {
      context.class(classObject.prototype).decorators.add($AllChecked);
      context
        .class(classObject.prototype)
        .methods.forEach((methodInfo, methodKey) => {
          const descriptor = Object.getOwnPropertyDescriptor(
            classObject.prototype,
            methodKey
          )!;
          Object.defineProperty(classObject.prototype, methodKey, {
            value: function () {
              methodInfo.parameters.forEach((paramInfo, paramIndex) => {
                if (paramInfo.decorators.has($NotNull)) {
                  if (arguments[paramIndex] == null) {
                    onNullCheckFailed(classObject, methodKey, paramIndex);
                  }
                }
              });
              return descriptor.value.apply(this, arguments);
            },
          });
        });
    },
  }),
};

import { autobind } from "core-decorators";
import { Internal } from "..";
import { UtilTypes } from "../types";
import { HubSwitch } from "../utils/design-patterns";

export interface IExtension<T> {
  target: UtilTypes.ConstructorOf<T>;
  name: string;
  install(): void;
  uninstall(): void;
}

export type MethodMixin<T> = Partial<UtilTypes.MethodsOf<T>>;
export type PropertyMixin<T> = Pick<T, UtilTypes.PropertyKeys<T>>;

@autobind
export class MethodExtension<T> implements IExtension<T> {
  readonly keys = new Set<string>();
  constructor(
    /**
     * The constructor
     */
    public readonly target: UtilTypes.ConstructorOf<T>,
    /**
     * The method mixin object, which contains the methods.
     */
    public readonly methodMixin: MethodMixin<T>,
    /**
     * The extension name, just for some infomation.
     */
    public readonly name: string = ""
  ) {
    this.name = name || `${target.name}--Extension`;
  }

  install() {
    const extensionName = this.name;
    for (const [methodName, methodFunc] of Object.entries<Function>(
      this.methodMixin
    )) {
      if (this.keys.has(methodName)) {
        Internal.warn(
          `It seems you are reinstalling the extension ${extensionName}`
        );
        return;
      }
      if (methodName in this.target.prototype) {
        Internal.warn(
          `The method name '${methodName}' of extension ${extensionName} has been occupied, replacing...`
        );
      }
      this.keys.add(methodName);
      this.target.prototype[methodName] = function () {
        try {
          methodFunc.apply(this, arguments);
        } catch (e) {
          Internal.warn(
            `Error occurred when invoking extension method '${methodName}' of extension '${extensionName}' with arguments (\`this\` is the first argument)`,
            this,
            ...arguments
          );
          throw e;
        }
      };
    }
  }
  uninstall() {
    for (let key of this.keys) {
      delete this.target.prototype[key];
    }
    this.keys.clear();
  }
}

export function makeMethodExtension<T>(
  constructor: UtilTypes.ConstructorOf<T>,
  ext: MethodMixin<T>,
  name?: string
) {
  return new MethodExtension(constructor, ext, name);
}

@autobind
export class PropertyExtension<T> implements IExtension<T> {
  private readonly keys = new Set<string>();
  constructor(
    public readonly target: UtilTypes.ConstructorOf<T, unknown[]>,
    public readonly propertyMixin: PropertyMixin<T>,
    public readonly name: string = ""
  ) {
    this.name = name || `${target.name}--Extension`;
  }
  install(): void {
    for (const [key, value] of Object.entries<unknown>(this.propertyMixin)) {
      if (this.keys.has(key)) {
        Internal.warn(
          `It seems you are reinstalling the extension ${this.name}`
        );
        return;
      }
      if (key in this.target.prototype) {
        Internal.warn(
          `The property name '${key}' of extension ${this.name} has been occupied, replacing...`
        );
      }
      this.target.prototype[key] = value;
    }
  }
  uninstall(): void {
    for (let key of this.keys) {
      delete this.target.prototype[key];
    }
    this.keys.clear();
  }
}

export function makePropertyExtension<T>(
  target: UtilTypes.ConstructorOf<T>,
  mix: PropertyMixin<T>,
  name?: string
) {
  return new PropertyExtension(target, mix, name);
}

export function useExtensions(extensions: IExtension<unknown>[]) {
  return new HubSwitch(extensions, "install", "uninstall", [], []);
}

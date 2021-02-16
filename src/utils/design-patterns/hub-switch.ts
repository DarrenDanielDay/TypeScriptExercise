import { autobind } from "core-decorators";
import { Functools } from "..";
import { MethodKeys } from "../../types/util-types";

@autobind
export class HubSwitch<
  T,
  OnKey extends MethodKeys<T>,
  OffKey extends MethodKeys<T>,
  OnParams extends Parameters<T[OnKey]>,
  OffParams extends Parameters<T[OffKey]>
> {
  constructor(
    public readonly targets: T[],
    public readonly onKey: OnKey,
    public readonly offKey: OffKey,
    public readonly onParams: OnParams,
    public readonly offParams: OffParams
  ) {}

  switchOn() {
    Functools.hubCall(this.targets, this.onKey, ...this.onParams);
  }

  switchOff() {
    Functools.hubCall(this.targets, this.offKey, ...this.offParams);
  }

  withSwitchOnScope(callback: (targets: T[]) => unknown) {
    this.switchOn();
    callback(this.targets);
    this.switchOff();
  }
  async withSwitchOnScopeAsync(callback: (targets: T[]) => unknown) {
    this.switchOn();
    const result = callback(this.targets);
    if (result instanceof Promise) {
      await result;
    }
    this.switchOff();
  }
}

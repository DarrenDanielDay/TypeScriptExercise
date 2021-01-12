import { autobind } from "core-decorators";
import { Functools } from ".";
import { UtilTypes } from "../types";

@autobind
export class HubSwitch<
  T,
  OnKey extends UtilTypes.MethodKeys<T>,
  OffKey extends UtilTypes.MethodKeys<T>,
  OnParams extends Parameters<T[OnKey]> & Iterable<any>,
  OffParams extends Parameters<T[OffKey]> & Iterable<any>
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

  async withSwitchOnScope(callback: (targets?: T[]) => any) {
    this.switchOn();
    const result = callback(this.targets);
    if (result instanceof Promise) {
      await result;
    }
    this.switchOff();
  }
}

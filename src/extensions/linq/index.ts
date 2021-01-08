import { Extension } from "../../interfaces";
import { UtilTypes } from "../../types";

export const LinqExtension: Extension.IExtension = {
  install() {
    Array.prototype.select = function* <T, R>(
      this: T[],
      selector: UtilTypes.Mapper<T, R>
    ) {
      for (let item of this) {
        yield selector(item);
      }
    };

    Array.prototype.where = function* <T>(
      this: T[],
      predicate: UtilTypes.Predicate<T>
    ) {
      for (let item of this) {
        predicate(item) && (yield item);
      }
    };
  },
  uninstall() {
    delete Array.prototype.select;
    delete Array.prototype.where;
  },
};

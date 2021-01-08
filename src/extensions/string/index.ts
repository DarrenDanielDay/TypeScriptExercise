import { Extension } from "../../interfaces";

export const StringExtension: Extension.IExtension = {
  install() {
    String.prototype.forEach = function (
      callback: (character: string) => void
    ) {
      for (const character of this) {
        callback(character);
      }
    };
  },
  uninstall() {
    delete String.prototype.forEach;
  },
};

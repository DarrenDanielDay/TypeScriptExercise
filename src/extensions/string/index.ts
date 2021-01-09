import { Extensions } from "../../interfaces";

export const StringExtension: Extensions.IExtension = {
  name: "string-utilsss",
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

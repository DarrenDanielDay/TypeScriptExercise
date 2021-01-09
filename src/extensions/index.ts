import { Extensions } from "../interfaces";

export class ExtensionInstaller {
  constructor(private readonly extensions: Extensions.IExtension[]) {}
  enableAll = () =>
    this.extensions.forEach((extension) => {
      try {
        extension.install();
      } catch (e) {
        throw new Error(`install plugin \`${extension.name}\` install failed`);
      }
    });

  disableAll = () =>
    this.extensions.forEach((extension) => {
      try {
        extension.uninstall();
      } catch (e) {
        throw new Error(
          `install plugin \`${extension.name}\` uninstall failed`
        );
      }
    });

  useScoped = async (callback: () => any) => {
    this.enableAll();
    const result = callback();
    if (result?.then) {
      await result;
    }
    this.disableAll();
  };
}

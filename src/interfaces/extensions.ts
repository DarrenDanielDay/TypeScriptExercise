export interface IExtension {
  name: string;
  install(): void;
  uninstall(): void;
}

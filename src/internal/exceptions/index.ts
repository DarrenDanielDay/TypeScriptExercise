export class InternalError extends Error {}

export function error(message: string): never {
  throw new InternalError(message);
}

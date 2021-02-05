export function wait(delay: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, delay));
}

export async function sleep(delay: number) {
  await wait(delay * 1000);
}

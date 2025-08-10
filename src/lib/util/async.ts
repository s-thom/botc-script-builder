export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((res, rej) => {
    const handle = setTimeout(res, ms);
    signal?.addEventListener("abort", (e) => {
      clearTimeout(handle);
      rej(e);
    });
  });
}

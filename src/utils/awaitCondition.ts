function wait(delay: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

/**
 * Returns a promise that resolves when condition is met.
 * @param condition Callback: the promise will only resolve when this is truthy
 * @param delay delay before retrying
 * @returns A promise that resolves when the condition is met
 */
export default function awaitCondition(condition: () => any, delay = 100): Promise<void> {
  return new Promise(async (resolve) => {
    while (!condition()) {
      await wait(delay);
    }

    resolve();
  });
}

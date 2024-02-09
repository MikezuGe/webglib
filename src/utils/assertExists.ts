export const defaultMessage = "Expected value to exist";

export function assertExists<T>(
  value: T,
  message?: string,
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message ?? defaultMessage);
  }
}

/**
 * Reads an integer from URLSearchParams with validation.
 * - Returns the parsed number if valid and >= min
 * - Otherwise falls back to the provided default
 */
export const getIntParam = (
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
  min = 1,
): number => {
  const raw = searchParams.get(key);
  const n = raw === null ? NaN : Number(raw);
  return Number.isFinite(n) && n >= min ? n : fallback;
};

/**
 * Reads and validates an enum-like value from URLSearchParams.
 * - Uses a type guard to check if the value is allowed
 * - Returns the typed value if valid, otherwise undefined
 */
export const getEnumParam = <T extends string>(
  searchParams: URLSearchParams,
  key: string,
  isValid: (v: string) => v is T,
): T | undefined => {
  const raw = searchParams.get(key);
  return raw && isValid(raw) ? raw : undefined;
};

/**
 * Reads a string from URLSearchParams.
 * - Trims whitespace
 * - Returns undefined if empty or missing
 */
export const getStringParam = (searchParams: URLSearchParams, key: string): string | undefined => {
  const raw = searchParams.get(key);
  return raw?.trim() ? raw.trim() : undefined;
};

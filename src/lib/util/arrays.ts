/**
 * https://stackoverflow.com/a/37319954
 */
export function filterInPlace<T>(
  array: T[],
  condition: (value: T, index: number, array: T[]) => boolean
): T[] {
  let i = 0;
  let j = 0;

  while (i < array.length) {
    const val = array[i];
    if (condition(val, i, array)) {
      array[j++] = val;
    }
    i++;
  }

  array.length = j;
  return array;
}

export function groupBy<K extends string, T>(
  array: T[],
  callback: (value: T) => K
): Partial<Record<K, T[]>> {
  return array.reduce(
    (obj, value) => {
      const key = callback(value);
      obj[key] ??= [];
      obj[key].push(value);
      return obj;
    },
    {} as Partial<Record<K, T[]>>
  );
}

export function truthyOnly<T>(
  array: (T | 0 | false | null | undefined | "")[]
): T[] {
  // @ts-ignore
  return array.filter(Boolean);
}

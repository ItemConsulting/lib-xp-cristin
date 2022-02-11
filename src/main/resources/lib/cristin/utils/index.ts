export function notNull<T>(val: T | null): val is T {
  return val !== null;
}

export function notNullOrUndefined<T>(val: T | null | undefined | void): val is T {
  return val !== null && val !== undefined;
}

export function notEmptyOrUndefined(str?: string): str is string {
  return str !== undefined && str !== null && str.length > 0;
}

export function forceArray<A>(data: A | Array<A> | undefined): Array<A>;
export function forceArray<A>(data: A | ReadonlyArray<A> | undefined): ReadonlyArray<A>;
export function forceArray<A>(data: A | Array<A> | undefined): ReadonlyArray<A> {
  data = data || [];
  return Array.isArray(data) ? data : [data];
}

export function getCristinInstitutionIdByUnitId(unitId: string): string {
  return unitId.split(".")[0];
}

export function getLastSubstringAfter(str: string, separator: string): string {
  return str.substring(str.lastIndexOf(separator) + 1);
}

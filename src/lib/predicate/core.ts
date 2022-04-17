export function isAround(num: number, range: { min?: number; max?: number } = {}) {
	const { min = 0, max = Infinity } = range;
	return num >= min && num < max;
}

export function isArray<T>(
	val: unknown,
	predicate: (item: unknown, index: number, self: unknown[]) => item is T
): val is Array<T>;

export function isArray(val: unknown): val is Array<unknown>;

export function isArray<T = unknown>(
	val: unknown,
	predicate?: (item: unknown, index: number, items: unknown[]) => item is T
): val is Array<T> {
	if (predicate) return Array.isArray(val) && val.every(predicate);
	return Array.isArray(val);
}

export function isBoolean(val: unknown): val is boolean {
	return typeof val === 'boolean' || val instanceof Boolean;
}

export function isEmpty(val: unknown[] | string) {
	if (isString(val)) return val.replace(/\s+/g, '').length === 0;
	return val.length === 0;
}

export function isFunction(val: unknown): val is Function {
	return typeof val === 'function' || val instanceof Function;
}

export function isNullish(val: unknown): val is null | undefined {
	return val === null || val === undefined;
}

export function isNumber(val: unknown): val is number {
	return typeof val === 'number' || val instanceof Number;
}

export function isObject(val: unknown): val is object;

export function isObject<K extends PropertyKey>(
	val: unknown,
	properties: K[]
): val is Expand<Record<K, unknown>>;

export function isObject<K extends PropertyKey>(val: unknown, properties?: K[]) {
	const isObj = val !== null && typeof val === 'object' && val instanceof Object;
	return properties ? isObj && properties.every((key) => key in val) : isObj;
}

export function isPromise(val: unknown): val is Promise<unknown> {
	return val instanceof Promise;
}

export function isString(val: unknown): val is string {
	return typeof val === 'string' || val instanceof String;
}

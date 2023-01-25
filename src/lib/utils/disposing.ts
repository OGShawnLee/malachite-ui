import type { Collectable } from '$lib/types';
import { isArray, isFunction, isObject } from '$lib/predicate';

export function destroy(collectable: Collectable) {
	if (isArray(collectable)) collectable.forEach(destroy);
	else if (isFunction(collectable)) destroy(collectable());
	else if (isObject(collectable, ['destroy'])) destroy(collectable.destroy);
}

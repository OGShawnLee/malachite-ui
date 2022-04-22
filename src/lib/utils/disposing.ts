import type { Collectable } from '$lib/types';
import { isArray, isFunction, isObject, isPromise } from '$lib/predicate';

export async function destroy(collectable: Collectable) {
	if (isArray(collectable)) collectable.forEach(destroy);
	else if (isPromise(collectable)) collectable.then(destroy);
	else if (isFunction(collectable)) destroy(collectable());
	else if (isObject(collectable, ['destroy'])) destroy(collectable.destroy);
}

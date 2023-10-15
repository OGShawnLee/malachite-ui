import type { Collectable } from '$lib/types';
import type { Unsubscriber } from 'svelte/store';
import { destroy } from '$lib/utils';

export default function useCleanup(...collectable: Collectable[]): Unsubscriber {
	return () => destroy(collectable as Collectable);
}

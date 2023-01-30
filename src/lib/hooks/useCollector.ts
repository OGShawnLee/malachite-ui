import type { Collectable } from '$lib/types';
import type { Unsubscriber } from 'svelte/store';
import { destroy } from '$lib/utils';

export default function useCollector(options: {
	afterInit?: () => Collectable;
	beforeInit?: () => Collectable;
	init: () => Collectable;
	beforeCollection?: () => void;
}): Unsubscriber {
	const { afterInit, beforeCollection, beforeInit, init } = options;
	const collectable: Collectable[] = [];

	const before = beforeInit?.();
	const toCollect = init();
	const after = afterInit?.();

	collectable.push(before, toCollect, after);
	return () => {
		beforeCollection?.();
		destroy(collectable);
	};
}

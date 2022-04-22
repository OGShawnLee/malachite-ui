import type { Collectable } from '$lib/types';
import { destroy } from '@utils';

export function useCollector(options: {
	afterInit?: () => Collectable;
	beforeInit?: () => Collectable;
	init: () => Collectable;
	beforeCollection?: () => void;
}) {
	const { afterInit, beforeCollection, beforeInit, init } = options;
	const collectable: Collectable[] = [];

	const before = beforeInit?.();
	const toCollect = init();
	const after = afterInit?.();

	collectable.push(before, toCollect, after);
	return async () => {
		beforeCollection?.();
		destroy(collectable);
	};
}

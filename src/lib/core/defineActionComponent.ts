import type { ActionComponent, Collectable } from '$lib/types';
import { ElementBinder } from '$lib/core';
import { useCollector } from '$lib/hooks';

export default function defineActionComponent<T = void>(config: {
	binder?: ElementBinder;
	id: string | undefined;
	name: string;
	isShowing?: boolean;
	onInit?: (context: { binder: ElementBinder; name: string }) => T;
	onMount: (context: { binder: ElementBinder; element: HTMLElement; name: string }) => Collectable;
}): ActionComponent<T> {
	const { binder = new ElementBinder(), name, onMount, id, isShowing = true } = config;
	if (isShowing) {
		binder.name.set(name);
		binder.id.set(id);
	}
	const context = config.onInit?.({ binder, name }) as T;
	return {
		context,
		binder: binder,
		action: (element: HTMLElement) => {
			return {
				destroy: useCollector({
					beforeInit: () => binder.onMount(element, name),
					init: () => onMount?.({ binder, element, name })
				})
			};
		}
	};
}

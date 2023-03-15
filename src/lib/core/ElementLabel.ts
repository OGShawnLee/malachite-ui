import type ElementBinder from './ElementBinder';
import { Hashable } from '$lib/stores';
import { clearString } from '$lib/utils';
import { onDestroy } from 'svelte';
import { useCollector } from '$lib/hooks';
import { computed } from '$lib/utils';

export default class ElementLabel {
	protected readonly items = new Hashable<string, string | undefined>();
	readonly finalName = computed(this.items.values, (labels) => {
		if (labels.length) return clearString(labels.join(' '));
	});

	onInitLabel(this: ElementLabel, name: string, id: string | undefined) {
		this.items.set(name, id ?? name);
		onDestroy(this.items.destroy(name));
	}

	onMountLabel(this: ElementLabel, name: string, binder: ElementBinder) {
		return useCollector({
			beforeCollection: () => {
				this.items.set(name, undefined);
			},
			init: () =>
				binder.finalName.subscribe((id) => {
					this.items.set(name, id);
				})
		});
	}

	handleAriaDescribedby(this: ElementLabel, element: HTMLElement) {
		return this.finalName.subscribe((name) => {
			if (name) element.setAttribute('aria-describedby', name);
			else element.removeAttribute('aria-describedby');
		});
	}

	handleAriaLabelledby(this: ElementLabel, element: HTMLElement) {
		return this.finalName.subscribe((name) => {
			if (name) element.setAttribute('aria-labelledby', name);
			else element.removeAttribute('aria-labelledby');
		});
	}
}

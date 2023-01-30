import type { ReadableRef } from '$lib/types';
import type ElementBinder from './ElementBinder';
import { Hashable } from '$lib/stores';
import { clearString, createDerivedRef } from '$lib/utils';
import { onDestroy } from 'svelte';
import { useCollector } from '$lib/hooks';

export default class ElementLabel {
	readonly finalName: ReadableRef<string | undefined>;
	protected readonly items: Hashable<string, string | undefined>;

	constructor() {
		this.items = new Hashable({ keys: false, entries: false });
		this.finalName = createDerivedRef(this.items.values, (labels) => {
			if (labels.length) return clearString(labels.join(' '));
		});
	}

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

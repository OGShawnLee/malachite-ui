import type { Readable } from 'svelte/store';
import { Hashable } from '$lib/stores';
import { derived } from 'svelte/store';

export class Group {
	protected readonly Group: Hashable<HTMLElement, string>;
	readonly Name: Readable<string | undefined>;

	constructor() {
		this.Group = new Hashable();
		this.Name = derived(this.Group.Values, ($values) => {
			return $values.length ? $values.join(' ') : undefined;
		});
	}

	get subscribe() {
		return this.Group.subscribe;
	}

	add(node: HTMLElement, name: string) {
		this.Group.add(node, name);
		return this.Group.destroy(node);
	}

	set(node: HTMLElement, name: string) {
		this.Group.set(node, name);
	}

	get size() {
		return this.Group.size;
	}
}

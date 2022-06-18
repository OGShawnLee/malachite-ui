import type { Expand } from '$lib/types'
import type { Readable, Writable } from 'svelte/store';
import { useCollector, useDOMTraversal, useValidator } from '$lib/hooks';
import { isHTMLElement } from '$lib/predicate';
import { everyWithIndex } from '$lib/utils';
import { derived, readable, writable } from 'svelte/store';

export class Ordered<T> {
	protected readonly hash = new Map<HTMLElement, T & Member>();
	protected readonly Hash = writable(this.hash);
	protected readonly ShouldOrder: Readable<boolean>;

	readonly Children = derived(this.Hash, (hash) => {
		return Array.from(hash).reduce((children, [child, { index }]) => {
			children[index] = child;
			return children;
		}, [] as HTMLElement[]);
	});
	readonly Members = derived(this.Hash, (hash) => {
		return Array.from(hash.values()).reduce((members, member) => {
			members[member.index] = member;
			return members;
		}, [] as Array<T & Member>);
	});

	protected parent: HTMLElement | undefined;
	protected children: HTMLElement[] = [];

	constructor(ShouldOrder = readable(true)) {
		this.ShouldOrder = ShouldOrder;
	}

	get subscribe() {
		return this.Hash.subscribe;
	}

	add(child: HTMLElement, value: T & Item) {
		const duplicate = this.has(child);
		if (duplicate) throw new Error('Duplicate Item');

		const destroy = this.destroy(child);
		const member = { index: this.size, child, ...value, destroy };
		this.Hash.update((hash) => hash.set(child, member));
		return member;
	}

	elementAt(index: number) {
		return this.children.at(index);
	}

	delete(child: HTMLElement) {
		const deleted = this.hash.has(child);
		this.Hash.update((hash) => {
			return hash.delete(child), hash;
		});
		return deleted;
	}

	deleteWithIndex(index: number) {
		const element = this.elementAt(index);
		if (element) this.delete(element);
	}

	destroy(child: HTMLElement) {
		return () => this.delete(child);
	}

	destroyWithIndex(index: number) {
		return () => this.deleteWithIndex(index);
	}

	get(child: HTMLElement) {
		return this.hash.get(child);
	}

	getWithIndex(index: number) {
		const element = this.children.at(index);
		if (element) return this.get(element);
	}

	has(key: HTMLElement) {
		return this.hash.has(key);
	}

	indexOf(child: HTMLElement) {
		return this.children.indexOf(child);
	}

	get size() {
		return this.hash.size;
	}

	update(key: HTMLElement, callback: (item: Member & T) => Member & T) {
		if (this.has(key)) {
			this.Hash.update((hash) => {
				const item = hash.get(key);
				return item ? hash.set(key, callback(item)) : hash;
			});
		}
	}

	initOrdering(parent: HTMLElement) {
		const loop = useValidator(this.Hash, this.ShouldOrder);
		return useCollector({
			beforeInit: () => {
				this.parent = parent;
				this.children = useDOMTraversal(parent, (element) => {
					return isHTMLElement(element) && this.has(element);
				}) as HTMLElement[];
			},
			beforeCollection: () => {
				this.parent = undefined;
				this.children = [];
			},
			init: () =>
				loop((hash) => {
					const entries = Array.from(hash.entries());
					const isInfinite = entries.some(([child]) => !document.contains(child));
					if (isInfinite) return;

					const children = (this.children = useDOMTraversal(parent, (element) => {
						return isHTMLElement(element) && hash.has(element);
					}) as HTMLElement[]);

					const [isOrdered, index] = everyWithIndex(entries, ([child, { index }]) => {
						return child === children[index];
					});

					if (isOrdered) return;

					console.log('Ordering...');

					entries.slice(index).forEach(([child, member]) => {
						const index = children.indexOf(child);
						member.Index.set((member.index = index));
					});

					this.Hash.set(hash);
				})
		});
	}
}

type Member = Expand<Ordered.Member>;
type Item = Expand<Ordered.Item>;

export namespace Ordered {
	export interface Item {
		readonly Index: Writable<number>;
	}

	export interface Member extends Item {
		readonly child: HTMLElement;
		index: number;
	}
}

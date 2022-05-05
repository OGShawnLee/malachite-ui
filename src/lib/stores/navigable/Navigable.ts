import Navigation from './Navigation';
import type { Expand, Navigable as Nav } from '$lib/types';
import type { Bridge } from '$lib/stores/Bridge';
import type { Unsubscriber } from 'svelte/store';
import { useCollector, useListener } from '$lib/hooks';
import { tick } from 'svelte';
import { makeUnique } from '$lib/utils';

export class Navigable<T = {}> extends Navigation<T> {
	constructor(Options: Expand<Nav.Options<T>>) {
		super(Options);
	}

	listen() {
		return useCollector({
			init: () => super.listen(),
			afterInit: async () => {
				await tick();
				if (this.isValidIndex(this.index)) return;
				this.set(this.findValidIndex({ direction: 'BOUNCE' }), false);
			}
		});
	}

	protected add(
		element: HTMLElement,
		{ Bridge, Value }: { Bridge: Bridge; Value: T & Omit<Nav.Item, 'element'> }
	) {
		const { Active, Selected, isDisabled } = Bridge;
		return this.Ordered.add(element, { Active, Selected, isDisabled, element, ...Value });
	}

	initNavigation(
		parent: HTMLElement,
		options: {
			handler?: (this: Navigable, parent: HTMLElement) => Unsubscriber;
			plugins?: Array<(this: Navigable, parent: HTMLElement) => Unsubscriber>;
		} = {}
	): () => Promise<void> {
		const { handler, plugins = [] } = options;
		return useCollector({
			init: () => [this.Ordered.initOrdering(parent), this.listen()],
			afterInit: () => {
				return [
					handler?.bind(this)(parent),
					makeUnique(plugins).map((plugin) => plugin.bind(this)(parent))
				];
			}
		});
	}

	initItem(element: HTMLElement, { Bridge, Value }: { Bridge: Bridge; Value: T & Nav.Item }) {
		const set = (index: number) => this.set(index, false);
		const { Index } = this.add(element, { Bridge, Value });
		let index = 0;
		return useCollector({
			beforeCollection: async () => {
				this.Ordered.delete(element);
				await tick();
				if (this.index >= this.length) {
					set(this.findValidIndex({ direction: 'BACK' }));
				}
			},
			init: () => [
				Index.subscribe((currentIndex) => {
					index = currentIndex;
				}),
				Bridge.Disabled.subscribe((isDisabled) => {
					this.Ordered.update(element, (member) => {
						return { ...member, isDisabled };
					});
					if (isDisabled && this.isSelected(element)) {
						set(this.findValidIndex({ direction: 'BOUNCE', startAt: index }));
					}
				}),
				useListener(element, 'click', () => this.set(index))
			]
		});
	}
}

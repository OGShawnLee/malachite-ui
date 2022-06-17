import type {
	ActionComponent,
	Expand,
	ExtractContextKeys,
	Navigable as Nav,
	ReadableWrapper
} from '$lib/types';
import { defineActionComponent, initIndexGenerator } from '$lib/core';
import { useComponentNaming, useContext } from '$lib/hooks';
import { Bridge, Navigable, Ordered } from '$lib/stores';
import { isFunction, isInterface } from '$lib/predicate';
import { writable } from 'svelte/store';
import { ref, setAttribute } from '$lib/utils';
import { useFocusSync, useResetOnItemOutside } from '$lib/stores/addons';

interface Configuration {
	Vertical: ReadableWrapper<boolean>;
	Global: ReadableWrapper<boolean>;
}

interface Context {
	initItem(Item: Bridge): ActionComponent;
}

export type ContextKeys = ExtractContextKeys<Context>;

const generateIndex = initIndexGenerator();

export function createNavigable({ Global, Vertical }: Expand<Configuration>) {
	const { baseName, nameChild } = useComponentNaming({ name: 'navigable', index: generateIndex() });
	const Items = new Ordered<Nav.Member>();
	const Navigation = new Navigable({ Ordered: Items, Vertical, Index: 0 });

	setContext({ initItem });

	function focustFirstValidItem() {
		const index = Navigation.findIndexFromStart();
		return index > -1 && Navigation.at(index)?.focus();
	}

	function createSelf() {
		return defineActionComponent({
			onMount: baseName,
			destroy: ({ element }) => [
				Navigation.initNavigation(element, {
					plugins: [useFocusSync, useResetOnItemOutside]
				}),
				Navigation.initNavigationHandler({
					parent: element,
					isWindowNavigation: ref(false, Global),
					callback({ event, code, ctrlKey, isWindowNavigation }) {
						switch (code) {
							case 'ArrowDown':
								event.preventDefault();
								if (this.isVertical && !ctrlKey && !this.hasFocusWithin())
									return focustFirstValidItem();

								return this.handleNextKey(code, ctrlKey);
							case 'ArrowRight':
								event.preventDefault();
								if (!this.isVertical && !ctrlKey && !this.hasFocusWithin())
									return focustFirstValidItem();

								return this.handleNextKey(code, ctrlKey);
							case 'ArrowLeft':
							case 'ArrowUp':
								event.preventDefault();
								return this.handleBackKey(code, ctrlKey);
							case 'Home':
								if (isWindowNavigation) return;
								event.preventDefault();
								return this.goFirst();
							case 'End':
								if (isWindowNavigation) return;
								event.preventDefault();
								return this.goLast();
						}
					}
				})
			]
		});
	}

	function initItem(Item: Bridge) {
		return defineActionComponent({
			Bridge: Item,
			onMount: ({ element }) => {
				setAttribute(element, ['tabIndex', '0'], {
					overwrite: true,
					predicate: () => element.tabIndex < 0,
					tickCheck: false
				});
				return nameChild('item', Items.size);
			},
			destroy: ({ element }) => {
				const Index = writable(Items.size);
				return [
					Navigation.initItem(element, {
						Bridge: Item,
						Value: { Index }
					}),
					Index.subscribe((index) => (Item.name = nameChild('item', index)))
				];
			}
		});
	}

	return { Global, Vertical, self: createSelf(), initItem };
}

const { getContext, setContext } = useContext({
	component: 'navigable',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			initItem: isFunction
		})
});

export { getContext };

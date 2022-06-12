import type { ActionComponent, Expand, Navigable as Nav, Store } from '$lib/types';
import type { Readable } from 'svelte/store';
import {
	defineActionComponent,
	defineActionComponentWithParams,
	initIndexGenerator
} from '$lib/core';
import { useComponentNaming, useContext } from '$lib/hooks';
import { Bridge, Navigable, Ordered } from '$lib/stores';
import { isFunction, isInterface } from '$lib/predicate';
import { writable } from 'svelte/store';
import { setAttribute } from '$lib/utils';
import { useFocusSync, useResetOnLeave } from '$lib/stores/addons';

interface Configuration {
	Vertical: Store<Readable<boolean>>;
}

interface Context {
	initItem(Item: Bridge): ActionComponent;
}

const generateIndex = initIndexGenerator();

export function createNavigable({ Vertical }: Expand<Configuration>) {
	const { baseName, nameChild } = useComponentNaming({
		component: 'navigable',
		index: generateIndex()
	});
	const Items = new Ordered<Nav.Member>();
	const Navigation = new Navigable({ Ordered: Items, Vertical });

	setContext({ initItem });

	function createSelf() {
		return defineActionComponent({
			onMount: baseName,
			destroy: ({ element }) =>
				Navigation.initNavigation(element, {
					plugins: [useFocusSync, useResetOnLeave],
					handler() {
						return Navigable.initNavigationHandler(element, ({ code, ctrlKey }) => {
							switch (code) {
								case 'ArrowDown':
								case 'ArrowRight':
									return this.handleNextKey(code, ctrlKey);
								case 'ArrowLeft':
								case 'ArrowUp':
									return this.handleBackKey(code, ctrlKey);
							}
						});
					}
				})
		});
	}

	function initItem(Item: Bridge) {
		return defineActionComponentWithParams<boolean>({
			Bridge: Item,
			onMount: ({ element }) => {
				setAttribute(element, ['tabIndex', '0'], {
					overwrite: true,
					predicate: () => element.tabIndex < 0
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
					Index.subscribe((index) => {
						Item.name = nameChild('item', index);
					})
				];
			}
		});
	}

	return { Vertical, self: createSelf(), sync: Navigation.sync };
}

const { getContext, setContext } = useContext({
	component: 'navigable',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			initItem: isFunction
		})
});

export { getContext };

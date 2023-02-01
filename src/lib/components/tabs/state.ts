import type { Readable } from 'svelte/store';
import type {
	ComponentInitialiser,
	ComponentInitialiserStrict,
	Navigation,
	ReadableRef
} from '$lib/types';
import { Navigable } from '$lib/stores';
import { ElementBinder, defineActionComponent } from '$lib/core';
import { useComponentNaming, useCollector, useContext } from '$lib/hooks';
import { createReadableRef } from '$lib/utils';
import { isFunction, isInterface, isNullish, isReadableRef } from '$lib/predicate';
import { handleAriaOrientation } from '$lib/plugins';

export function createTabGroupState(settings: Navigation.Settings) {
	const navigation = new Navigable<Tab>(settings);
	const { nameChild } = useComponentNaming('tabs');

	setContext({
		index: createReadableRef(navigation.index),
		createPanel,
		createPanels,
		createTab,
		createTabList
	});

	function createTabList(id: string | undefined) {
		return defineActionComponent({
			id: id,
			name: nameChild('tablist'),
			onInit: () => createReadableRef(navigation.isVertical),
			onMount: ({ element }) => {
				element.role = 'tablist';
				return [
					navigation.initNavigation(element, {
						plugins: [handleAriaOrientation]
					})
				];
			}
		});
	}

	function createTab(id: string | undefined, binder: ElementBinder) {
		return defineActionComponent({
			binder: binder,
			name: nameChild('tab'),
			id: id,
			onInit: ({ name, binder }) => {
				return navigation.onInitItem(name, binder, { panelName: undefined });
			},
			onMount: ({ binder, element, name }) => {
				element.role = 'tab';
				return [
					navigation.initItem(element, name),
					binder.isSelected.subscribe((isSelected) => {
						if (isSelected) {
							element.ariaSelected = 'true';
							element.tabIndex = 0;
						} else {
							element.ariaSelected = 'false';
							element.tabIndex = -1;
						}
					})
				];
			}
		});
	}

	function createPanels(id: string | undefined) {
		return defineActionComponent({
			id: id,
			name: nameChild('panels'),
			onMount: () => {}
		});
	}

	function createPanel(id: string | undefined, binder: ElementBinder) {
		const tab = navigation.get(({ item: { panelName } }) => isNullish(panelName));
		const name = nameChild('panel');
		navigation.update(tab.name, (tab) => {
			tab.panelName = name;
			return tab;
		});

		return defineActionComponent<Tab>({
			binder: binder,
			id: id,
			name: name,
			onInit: () => tab.item,
			onMount({ element, binder: { finalName } }) {
				element.role = 'tabpanel';
				element.tabIndex = 0;
				return useCollector({
					beforeCollection: () => {
						if (tab.item.element) tab.item.element.removeAttribute('aria-controls');
					},
					init: () => [
						tab.item.binder.finalName.subscribe((id) => {
							if (id) element.setAttribute('aria-labelledby', id);
							else element.removeAttribute('aria-labelledby');
						}),
						finalName.subscribe((name) => {
							if (name && tab.item.element) tab.item.element.setAttribute('aria-controls', name);
							else if (tab.item.element) tab.item.element.removeAttribute('aria-controls');
						})
					]
				});
			}
		});
	}

	return {
		isFinite: navigation.isFinite,
		isManual: navigation.isManual,
		isVertical: navigation.isVertical
	};
}

export interface Tab extends Navigation.Item {
	panelName: string | undefined;
}

interface Context {
	index: Readable<number>;
	createPanel: ComponentInitialiserStrict<Tab>;
	createPanels: ComponentInitialiser;
	createTab: ComponentInitialiserStrict<number>;
	createTabList: ComponentInitialiser<ReadableRef<boolean>>;
}

const { getContext, setContext } = useContext({
	component: 'tabs',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			createPanel: isFunction,
			createPanels: isFunction,
			createTab: isFunction,
			createTabList: isFunction,
			index: isReadableRef
		})
});

export { getContext };

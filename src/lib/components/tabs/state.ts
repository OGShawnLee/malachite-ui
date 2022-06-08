import type { Expand, ExtractContext, Navigable as Nav, Nullable, Store } from '$lib/types';
import type { Readable, Writable } from 'svelte/store';
import { Component } from '$lib/core';
import { Bridge, Hashable, Ordered, Navigable } from '$lib/stores';
import { useManualSync } from '$lib/stores/addons';
import { derived, writable } from 'svelte/store';
import { useCollector, useContext, usePair } from '$lib/hooks';
import { makeReadable } from '$lib/utils';
import { isActionComponent, isFunction, isInterface, isObject, isStore } from '$lib/predicate';
import { onDestroy } from 'svelte';

export default class Tabs extends Component {
	protected readonly Navigable: Navigable;
	protected readonly Tabs: Ordered<Nav.Member>;
	protected readonly Panels = new Hashable<number, PanelInstance>();

	readonly Index: Readable<number>;
	readonly Manual: Store<Readable<boolean>>;
	readonly ShouldOrder: Store<Readable<boolean>>;
	readonly Vertical: Store<Readable<boolean>>;

	constructor({ Index, Manual, Vertical, ShouldOrder }: Expand<Options>) {
		super({ component: 'tabs', index: Tabs.generateIndex() });

		this.Manual = Manual;
		this.ShouldOrder = ShouldOrder;
		this.Vertical = Vertical;

		this.Tabs = new Ordered(ShouldOrder);
		this.Navigable = new Navigable({ Ordered: this.Tabs, Index, Manual, Vertical });
		this.Index = makeReadable(this.Navigable);

		Context.setContext({
			Index: this.Index,
			initPanel: this.initPanel.bind(this),
			initTab: this.initTab.bind(this),
			tabList: this.tabList,
			tabPanels: this.tabPanels
		});
	}

	get sync() {
		return this.Navigable.sync;
	}

	get tabList() {
		return this.defineActionComponent({
			onMount: ({ element }) => {
				element.setAttribute('role', 'tablist');
				return this.nameChild('list');
			},
			destroy: ({ element }) => [
				this.Vertical.subscribe((isVertical) => {
					element.ariaOrientation = isVertical ? 'vertical' : 'horizontal';
				}),
				this.Navigable.initNavigation(element, {
					plugins: [useManualSync],
					handler() {
						return Navigable.initNavigationHandler(element, ({ event, code, ctrlKey }) => {
							switch (code) {
								case 'ArrowDown':
								case 'ArrowRight':
									event.preventDefault();
									return this.handleNextKey(code, ctrlKey);
								case 'ArrowLeft':
								case 'ArrowUp':
									event.preventDefault();
									return this.handleBackKey(code, ctrlKey);
								case 'End':
									return this.goLast();
								case 'Home':
									return this.goFirst();
							}
						});
					}
				}),
				this.Navigable.listenSelected(({ selected, previous }) => {
					if (selected) {
						const [element] = selected;
						element.ariaSelected = 'true';
						element.tabIndex = 0;
					}

					if (previous) {
						const [element] = previous;
						element.ariaSelected = 'false';
						element.tabIndex = -1;
					}
				})
			]
		});
	}

	initTab(this: Tabs, Tab: Bridge) {
		return this.defineActionComponent({
			Bridge: Tab,
			onMount: ({ element }) => {
				element.tabIndex = -1;
				element.setAttribute('role', 'tab');
				element.ariaSelected = 'false';
				const index = this.Tabs.size;
				return this.nameChild({ name: 'tab', index });
			},
			destroy: ({ element }) => {
				const Index = writable(this.Tabs.size);
				const Panel = derived([Index, this.Panels.Values], ([index, panels]) => {
					return panels.at(index) || { element: undefined };
				});
				return useCollector({
					init: () => [
						this.Navigable.initItem(element, {
							Bridge: Tab,
							Value: { Index }
						}),
						Index.subscribe((index) => {
							Tab.name = this.nameChild({ name: 'tab', index });
						}),
						usePair(Tab.Disabled, Index).subscribe(([isDisabled, index]) => {
							const panelInstance = this.Panels.get(index);
							panelInstance?.Disabled.set(isDisabled);
						})
					],
					afterInit: () =>
						Panel.subscribe(({ element: panel }) => {
							if (panel) {
								if (panel.id) element.setAttribute('aria-controls', panel.id);
								if (Tab.name) panel.setAttribute('aria-labelledby', Tab.name);
							} else element.removeAttribute('aria-controls');
						})
				});
			}
		});
	}

	get tabPanels() {
		return this.defineActionComponent({
			onMount: this.nameChild('panels')
		});
	}

	initPanel(this: Tabs, Panel: Bridge) {
		const { index, value } = this.Panels.push({ Disabled: writable() });

		onDestroy(() => this.Panels.delete(index));

		const panel = this.defineActionComponent({
			Bridge: Panel,
			onMount: ({ element }) => {
				element.tabIndex = 0;
				element.setAttribute('role', 'tabpanel');
				return this.nameChild({ name: 'panel', index });
			},
			destroy: ({ element }) => {
				if (this.Panels.has(index)) {
					this.Panels.update(index, (panel) => {
						return { ...panel, element };
					});
				}
				return () => {
					if (this.Panels.has(index)) {
						this.Panels.update(index, (panel) => {
							return { ...panel, element: undefined };
						});
					}
				};
			}
		});

		return { Disabled: value.Disabled, index, ...panel };
	}

	private static generateIndex = this.initIndexGenerator();
}

interface PanelInstance {
	Disabled: Writable<Nullable<boolean>>;
	element?: HTMLElement;
}

interface Options {
	Index: Writable<number>;
	Manual: Store<Readable<boolean>>;
	ShouldOrder: Store<Readable<boolean>>;
	Vertical: Store<Readable<boolean>>;
}

export const Context = useContext({
	component: 'tabs',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			Index: isStore,
			initPanel: isFunction,
			initTab: isFunction,
			tabList: isActionComponent,
			tabPanels: isActionComponent
		})
});

type Context = ExtractContext<Tabs, 'Index' | 'initPanel' | 'initTab' | 'tabList' | 'tabPanels'>;

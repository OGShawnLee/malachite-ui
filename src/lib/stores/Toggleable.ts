import type { Ref, Toggler } from '$lib/types';
import type { Unsubscriber } from 'svelte/store';
import Hashable from './Hashable';
import { derived } from 'svelte/store';
import { useCollector, useListener } from '$lib/hooks';
import { focusFirstChildElement, ref, watch } from '$lib/utils';
import { isFocusable, isHTMLElement, isNullish, isWithin } from '$lib/predicate';
import { tick } from 'svelte';
import { useHidePanelFocusOnClose } from '$lib/plugins';

export class Toggleable {
	readonly isOpen = ref(false);
	readonly isFocusForced = ref(false);
	readonly noButtonFocus = ref(false);
	protected readonly button = ref<HTMLElement | undefined>(undefined);
	protected readonly panel = ref<HTMLElement | undefined>(undefined);
	readonly group?: ToggleableGroup;
	protected readonly groupClient?: ReturnType<ToggleableGroup['createClient']>;

	constructor({ isFocusForced = false, isOpen = false, group }: Toggler.Settings = {}) {
		this.isFocusForced.set(isFocusForced);
		this.isOpen.set(isOpen);
		this.group = group;
		this.groupClient = this.group?.createClient(this);
		watch(this.isOpen, (isOpen) => {
			this.handleFocusForce(isOpen);
		});
	}

	get subscribe() {
		return this.isOpen.subscribe;
	}

	get isClosed() {
		return this.isOpen.value() === false;
	}

	close(this: Toggleable, event?: Event | HTMLElement) {
		this.isOpen.set(false);
		this.handleFocus(event);
	}

	open(this: Toggleable) {
		this.isOpen.set(true);
	}

	toggle(this: Toggleable) {
		this.isOpen.update((isOpen) => !isOpen);
	}

	createButton(this: Toggleable, element: HTMLElement, settings: Toggler.ButtonOptions = {}) {
		const { plugins, isToggler = true } = settings;
		this.button.set(element);
		if (isToggler) element.setAttribute('type', 'button');
		return useCollector({
			beforeCollection: () => {
				this.button.set(undefined);
			},
			init: () => [
				isToggler && useListener(element, 'click', () => this.toggle()),
				this.initialisePlugins(element, plugins),
				this.groupClient?.createButton(element)
			]
		});
	}

	createOverlay(this: Toggleable, element: HTMLElement) {
		return useListener(element, 'click', () => this.close());
	}

	createPanel(this: Toggleable, element: HTMLElement, settings?: Toggler.PanelOptions) {
		const plugins = [useHidePanelFocusOnClose, ...(settings?.plugins ?? [])];
		this.panel.set(element);
		return useCollector({
			beforeCollection: () => {
				this.panel.set(undefined);
			},
			init: () => [
				settings?.onOpen && this.isOpen.subscribe((isOpen) => isOpen && settings.onOpen?.(element)),
				this.initialisePlugins(element, plugins),
				this.groupClient?.createPanel(element)
			]
		});
	}

	protected handleFocus(this: Toggleable, event?: Event | HTMLElement) {
		if (isNullish(event)) {
			if (this.noButtonFocus.value()) return;
			return this.button.value()?.focus();
		}

		if (event instanceof Event) {
			const target = event.target;
			if (this.noButtonFocus.value()) return;
			if (isHTMLElement(target) && this.isValidFocusTarget(target)) return;
			this.button.value()?.focus();
		} else {
			if (this.isValidFocusTarget(event)) event.focus();
			else if (!this.noButtonFocus.value()) this.button.value()?.focus();
		}
	}

	protected async handleFocusForce(this: Toggleable, isOpen: boolean) {
		await tick();
		const panel = this.panel.value();
		if (this.isFocusForced.value() && isOpen && panel) {
			focusFirstChildElement(panel);
		}
	}

	protected initialisePlugins(
		this: Toggleable,
		element: HTMLElement,
		plugins: Toggler.Plugin[] = []
	) {
		return plugins.map((plugin) => plugin.bind(this)(element));
	}

	protected isValidFocusTarget(this: Toggleable, target: HTMLElement) {
		if (!isFocusable(target)) return false;
		const panel = this.panel.value();
		return panel ? !isWithin(panel, target) : true;
	}

	isWithinElements(this: Toggleable, element: HTMLElement) {
		const button = this.button.value();
		const panel = this.panel.value();
		return (button && isWithin(button, element)) || (panel && isWithin(panel, element));
	}
}

interface Item {
	isOpen: boolean;
	toggler: Toggleable;
	close: () => void;
}

export class ToggleableGroup {
	protected currentOpenItem?: Item;
	protected elements: HTMLElement[] = [];
	protected items = new Hashable<Toggleable, Item>();
	readonly isOpen = derived(this.items.values, (items) => {
		return items.some((item) => item.isOpen);
	});
	readonly isUnique: Ref<boolean>;

	constructor(isUnique = false) {
		this.isUnique = ref(isUnique);
	}

	createClient(this: ToggleableGroup, toggler: Toggleable) {
		const item = {
			isOpen: toggler.isOpen.value(),
			toggler,
			close: () => toggler.isOpen.set(false)
		};
		this.items.set(toggler, item);

		function createButton(this: ToggleableGroup, element: HTMLElement) {
			this.elements.push(element);
			return useCollector({
				beforeCollection: () => {
					this.elements = this.elements.filter((el) => el !== element);
				},
				init: () =>
					toggler.isOpen.subscribe((isOpen) => {
						this.items.update(toggler, (item) => {
							item.isOpen = isOpen;
							return item;
						});

						if (isOpen) {
							if (this.isUnique.value() && this.currentOpenItem !== item)
								this.currentOpenItem?.close();
							this.currentOpenItem = item;
						}
					})
			});
		}

		function createPanel(this: ToggleableGroup, element: HTMLElement): Unsubscriber {
			this.elements.push(element);
			return () => {
				this.elements = this.elements.filter((el) => el !== element);
			};
		}

		return { createButton: createButton.bind(this), createPanel: createPanel.bind(this) };
	}

	isWithinElements(this: ToggleableGroup, element: HTMLElement) {
		return isWithin(this.elements, element);
	}
}

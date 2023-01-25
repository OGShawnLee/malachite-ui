import type { Toggler } from '$lib/types';
import { useCollector, useListener } from '$lib/hooks';
import { isFocusable, isHTMLElement, isNullish, isWithin } from '$lib/predicate';
import { focusFirstElement, ref } from '$lib/utils';
import { onDestroy, tick } from 'svelte';
import { useHidePanelFocusOnClose } from '$lib/plugins';

export default class Toggleable {
	readonly isOpen = ref(false);
	readonly isFocusForced = ref(false);
	protected readonly button = ref<HTMLElement | undefined>(undefined);
	protected readonly panel = ref<HTMLElement | undefined>(undefined);

	constructor({ isFocusForced = false, isOpen = false }: Toggler.Settings) {
		this.isOpen.value = isOpen;
		this.isFocusForced.value = isFocusForced;
		onDestroy(
			this.isOpen.subscribe((isOpen) => {
				this.handleFocusForce(isOpen);
			})
		);
	}

	get subscribe() {
		return this.isOpen.subscribe;
	}

	get isClosed() {
		return this.isOpen.value === false;
	}

	close(this: Toggleable, event?: Event | HTMLElement) {
		this.isOpen.value = false;
		this.handleFocus(event);
	}

	open(this: Toggleable) {
		this.isOpen.value = true;
	}

	toggle(this: Toggleable) {
		this.isOpen.value = !this.isOpen.value;
	}

	createButton(this: Toggleable, element: HTMLElement, settings: Toggler.ButtonOptions = {}) {
		const { plugins, isToggler = true } = settings;
		this.button.value = element;
		element.setAttribute('type', 'button');
		return useCollector({
			beforeCollection: () => {
				this.button.value = undefined;
			},
			init: () => [
				isToggler && useListener(element, 'click', () => this.toggle()),
				this.initialisePlugins(element, plugins)
			]
		});
	}

	createOverlay(this: Toggleable, element: HTMLElement) {
		return useListener(element, 'click', () => this.close());
	}

	createPanel(this: Toggleable, element: HTMLElement, settings?: Toggler.PanelOptions) {
		const plugins = [useHidePanelFocusOnClose, ...(settings?.plugins ?? [])];
		this.panel.value = element;
		return useCollector({
			beforeCollection: () => {
				this.panel.value = undefined;
			},
			init: () => [
				settings?.onOpen && this.isOpen.subscribe((isOpen) => isOpen && settings.onOpen?.(element)),
				this.initialisePlugins(element, plugins)
			]
		});
	}

	protected handleFocus(this: Toggleable, event?: Event | HTMLElement) {
		if (isNullish(event)) return this.button.value?.focus();
		if (event instanceof Event) {
			const target = event.target;
			if (isHTMLElement(target) && this.isValidFocusTarget(target)) return;
			this.button.value?.focus();
		} else {
			if (this.isValidFocusTarget(event)) event.focus();
			else this.button.value?.focus();
		}
	}

	protected async handleFocusForce(this: Toggleable, isOpen: boolean) {
		await tick();
		if (this.isFocusForced.value && isOpen && this.panel.value) {
			focusFirstElement(this.panel.value, {
				fallback: this.button.value
			});
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
		const panel = this.panel.value;
		return panel ? !isWithin(panel, target) : true;
	}

	isWithinElements(this: Toggleable, element: HTMLElement) {
		const button = this.button.value;
		const panel = this.panel.value;
		return (button && isWithin(button, element)) || (panel && isWithin(panel, element));
	}
}

import { Component } from '@core';
import { Hashable, storable, Toggleable } from '@stores';
import { type Readable, derived } from 'svelte/store';
import { useCollector, useContext, useDataSync, useListener, useWindowListener } from '@hooks';
import { tick } from 'svelte';
import { isObject, isWithin } from '@predicate';
import { makeReadable } from '@utils';

export default class Group extends Component {
	protected readonly Hash = new Hashable<HTMLElement, PopoverInstance>();
	protected readonly Mode = storable<'EXPANDED' | 'UNIQUE'>({ initialValue: 'UNIQUE' });

	set mode(mode: 'EXPANDED' | 'UNIQUE') {
		this.Mode.set(mode);
	}

	get mode() {
		return this.primitive.mode;
	}

	readonly AllOpen = derived(this.Hash.Values, (popovers) => {
		return popovers.length > 0 && popovers.every(({ isOpen }) => isOpen);
	});
	readonly AllClosed = derived(this.Hash.Values, (popovers) => {
		return popovers.every(({ isOpen }) => !isOpen);
	});
	readonly Open = derived(this.Hash.Values, (popovers) => {
		return popovers.some(({ isOpen }) => isOpen);
	});
	protected readonly Elements = derived(this.Hash.Entries, (entries) => {
		return entries.reduce((elements, [button, { panel }]) => {
			if (panel) elements.push(panel);
			return elements.push(button), elements;
		}, [] as HTMLElement[]);
	});

	protected primitive: {
		isOpen: boolean;
		buttons: HTMLElement[];
		elements: HTMLElement[];
		mode: 'EXPANDED' | 'UNIQUE';
		openPopover?: PopoverInstance;
		popovers: PopoverInstance[];
		eventTarget?: Nullable<EventTarget | Node>;
	} = {
		isOpen: false,
		buttons: [],
		elements: [],
		mode: 'UNIQUE',
		popovers: []
	};

	constructor({ mode }: { mode: 'EXPANDED' | 'UNIQUE' }) {
		super({ component: 'popover-group', index: Group.generateIndex() });
		this.mode = mode;
		GroupContext.setContext({
			Open: this.Open,
			initClient: this.initClient.bind(this),
			overlay: this.overlay
		});
		// onMount(this.listen.bind(this)); this does not run during testing...
	}

	listen() {
		const { Keys: Buttons, Values: Popovers } = this.Hash;
		const sync = useDataSync(this.primitive);
		return useCollector({
			beforeInit: () => [
				sync(Buttons, 'buttons'),
				sync(this.Elements, 'elements'),
				sync(this.Mode, 'mode'),
				sync(Popovers, 'popovers'),
				sync(this.Open, 'isOpen')
			],
			init: () => [this.handleClickOutside(), this.handleEscapeKey(), this.handleFocusLeave()]
		});
	}

	initClient(Toggleable: Toggleable) {
		return {
			Mode: makeReadable(this.Mode),
			button: (button: HTMLElement) => {
				return useCollector({
					beforeInit: () =>
						this.Hash.add(button, {
							button,
							isOpen: Toggleable.isOpen,
							close: () => Toggleable.set(false)
						}),
					init: () => [
						Toggleable.subscribe((isOpen) => {
							this.updatePopoverInstance(button, (popover) => {
								return { ...popover, isOpen };
							});
						}),
						this.handleExpanded(button, makeReadable(Toggleable))
					]
				});
			},
			panel: (panel: HTMLElement) => {
				return useCollector({
					beforeInit: () => {
						this.updatePopoverInstance(Toggleable.elements.button, (popover) => {
							return { ...popover, panel };
						});
					},
					init: () => this.handleFocusForced.bind(Toggleable)(panel),
					beforeCollection: () => {
						this.updatePopoverInstance(Toggleable.elements.button, (popover) => {
							return { ...popover, panel: undefined };
						});
					}
				});
			}
		};
	}

	get overlay() {
		return this.defineActionComponent({
			onMount: this.nameChild('overlay'),
			destroy: ({ element }) =>
				useListener(element, 'click', (event) => {
					if (event.target === element) this.closeAllPopovers();
				})
		});
	}

	protected closeAllPopovers() {
		this.focusPopoverButton();
		this.primitive.popovers.forEach(({ close }) => close());
	}

	protected findPopoverByEventTarget(target: Nullable<EventTarget | null>) {
		return this.primitive.popovers.find((popover) => {
			return target === popover.button || isWithin(popover.panel, target);
		});
	}

	protected focusPopoverButton() {
		const activeElement = document.activeElement;
		const isWithinPopovers = isWithin(this.primitive.elements, activeElement);

		if (isWithinPopovers) {
			if (isWithin(this.primitive.buttons, activeElement)) return;
			const popover = this.findPopoverByEventTarget(activeElement);
			return popover?.button.focus();
		}

		const popover = this.findPopoverByEventTarget(this.primitive.eventTarget);
		popover?.button.focus();
	}

	protected handleClickOutside() {
		return useWindowListener('click', (event) => {
			const target = event.target;
			if (target === document.body) return;
			if (this.primitive.isOpen && isWithin(document, target)) {
				if (isWithin(this.primitive.elements, target)) {
					return (this.primitive.eventTarget = target);
				}

				this.closeAllPopovers();
			}
		});
	}

	protected handleEscapeKey() {
		return useWindowListener('keydown', (event) => {
			if (this.primitive.isOpen && event.code === 'Escape') this.closeAllPopovers();
		});
	}

	protected handleExpanded(button: HTMLElement, Open: Readable<boolean>) {
		return Open.subscribe(async (isOpen) => {
			if (isOpen) {
				await tick();
				const popover = this.Hash.get(button);
				switch (this.mode) {
					case 'EXPANDED':
						return (this.primitive.openPopover = popover);
					case 'UNIQUE':
						const previousButton = this.primitive.openPopover?.button;
						if (button !== previousButton) this.primitive.openPopover?.close();
						return (this.primitive.openPopover = popover);
					default:
						break;
				}
			}
		});
	}

	protected handleFocusForced(this: Toggleable, panel: HTMLElement) {
		return useWindowListener('focusin', (event) => {
			const { isClosed, isFocusForced } = this;
			if (isClosed || !isFocusForced || document.body === event.target) return;
			if (!isWithin(panel, event.target)) this.close(event);
		});
	}

	protected handleFocusLeave() {
		return useWindowListener('focusin', async (event) => {
			if (event.target === document.body) return;

			if (this.primitive.isOpen) {
				await tick();
				const target = (this.primitive.eventTarget = event.target);

				if (isWithin(this.primitive.elements, target)) {
					return (this.primitive.eventTarget = target);
				}

				this.closeAllPopovers();
			}
		});
	}

	protected updatePopoverInstance(
		button: HTMLElement | undefined,
		callback: (item: PopoverInstance) => PopoverInstance
	) {
		if (button && this.Hash.has(button)) {
			this.Hash.update(button, callback);
		}
	}

	private static generateIndex = this.initIndexGenerator();

	static getMode(expanded: boolean) {
		return expanded ? 'EXPANDED' : 'UNIQUE';
	}
}

export const GroupContext = useContext({
	component: 'popover-group',
	predicate: (val): val is Context => isObject(val, ['initClient'])
});

interface PopoverInstance {
	isOpen: boolean;
	close: () => void;
	button: HTMLElement;
	panel?: HTMLElement;
	overlay?: HTMLElement;
}

type Context = ExtractContext<Group, 'Open' | 'initClient' | 'overlay'>;

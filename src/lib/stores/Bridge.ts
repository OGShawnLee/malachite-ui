import type { Collectable, Nullable } from '$lib/types';
import { makeReadable } from '$lib/utils';
import { useCollector, useDataSync, useValidator } from '$lib/hooks';
import { isDisabled } from '$lib/predicate';
import { writable } from 'svelte/store';
import { tick } from 'svelte';

export class Bridge {
	readonly Active = writable<boolean>(false);
	readonly Selected = writable<boolean>(false);
	readonly Disabled = writable<Nullable<boolean>>();
	readonly Name = writable<string | undefined>();

	protected readonly Stores = {
		Element: writable<HTMLElement | undefined>(),
		Mounted: writable<boolean>(false)
	};

	protected readonly primitive: {
		name?: string;
		element?: HTMLElement;
		isDisabled?: Nullable<boolean>;
	} = {};

	protected firstRender = true;
	isUsingSlot = false;
	onChange?: (element: HTMLElement) => void;
	protected watch?: (instance: Bridge) => Collectable;

	constructor(listen?: (instance: Bridge) => Collectable) {
		this.watch = listen;
	}

	get subscribe() {
		return this.Element.subscribe;
	}

	async sync({ disabled }: { disabled: Nullable<boolean> }) {
		if (this.isUsingSlot && this.firstRender) {
			this.firstRender = false;
			await tick();
			if (this.isDisabled) return; // -> we prioritise the element disabled attribute
		}

		if (this.isDisabled !== disabled) this.Disabled.set(disabled || undefined);
	}

	protected listen() {
		const sync = useDataSync(this.primitive);
		const loop = useValidator(this.Disabled, this.Stores.Mounted);
		return useCollector({
			afterInit: () => this.watch?.(this),
			beforeCollection: () => {
				this.Stores.Element.set(undefined);
				this.Name.set(undefined);
				this.Stores.Mounted.set(false);
			},
			init: () => [
				sync(this.Element, 'element'),
				sync(this.Name, 'name', (id) => {
					if (id && this.element) this.element.id = id;
				}),
				sync(this.Disabled, 'isDisabled'),
				loop((isDisabled) => {
					if (this.isUsingSlot) this.element?.toggleAttribute('disabled', isDisabled || false);
				})
			]
		});
	}

	onMount(element: HTMLElement, name: string) {
		this.Stores.Element.set(element);
		this.Name.set(name);
		if (isDisabled(element)) this.Disabled.set(true);
		this.Stores.Mounted.set(true);

		if (this.isUsingSlot) this.onChange?.(element);
		return this.listen();
	}

	get isDisabled() {
		return this.primitive.isDisabled;
	}

	get name() {
		return this.primitive.name;
	}

	set name(id: string | undefined) {
		this.Name.set(id);
		this.primitive.name = id;
	}

	get Element() {
		return makeReadable(this.Stores.Element);
	}

	get element() {
		return this.primitive.element;
	}
}

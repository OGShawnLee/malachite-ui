import { SvelteComponentTyped } from 'svelte';
import type { Nullable, RenderElementTagName } from '$lib/types';
import type { Readable, Writable } from 'svelte/store';

declare const __propDef: {
	props: {
		[x: string]: any;
		open?: boolean | Writable<boolean> | undefined;
		disabled?: Readable<Nullable<boolean>> | Nullable<boolean>;
		class?: Nullable<string>;
		as?: RenderElementTagName | undefined;
		element?: HTMLElement | undefined;
		use?: [action: import('svelte/action').Action<HTMLElement, any>, parameter?: any][] | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		'up-panel': {
			isDisabled: Nullable<boolean>;
			panel: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			close: (ref?: HTMLElement | Event | undefined) => void;
		};
		default: {
			isOpen: boolean;
			isDisabled: Nullable<boolean>;
			button: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			panel: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			close: (ref?: HTMLElement | Event | undefined) => void;
		};
		panel: {
			isDisabled: Nullable<boolean>;
			panel: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			close: (ref?: HTMLElement | Event | undefined) => void;
		};
	};
};

export declare type DisclosureProps = typeof __propDef.props;
export declare type DisclosureEvents = typeof __propDef.events;
export declare type DisclosureSlots = typeof __propDef.slots;
export default class Disclosure extends SvelteComponentTyped<
	DisclosureProps,
	DisclosureEvents,
	DisclosureSlots
> {}

export {};

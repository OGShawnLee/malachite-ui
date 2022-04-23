import { SvelteComponentTyped } from 'svelte';
import type { Nullable, RenderElementTagName } from '$lib/types';
import type { Readable } from 'svelte/store';

declare const __propDef: {
	props: {
		[x: string]: any;
		forceFocus?: boolean | Readable<boolean> | undefined;
		class?: Nullable<string>;
		as?: RenderElementTagName | undefined;
		disabled?: Nullable<boolean>;
		element?: HTMLElement | undefined;
		use?: [action: import('svelte/action').Action<HTMLElement, any>, parameter?: any][] | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		overlay: {
			overlay: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
		};
		'up-panel': {
			panel: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			close: (ref?: HTMLElement | Event | undefined) => void;
		};
		default: {
			isOpen: boolean;
			isDisabled: Nullable<boolean>;
			overlay: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			button: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			panel: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			close: (ref?: HTMLElement | Event | undefined) => void;
		};
		panel: {
			panel: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			close: (ref?: HTMLElement | Event | undefined) => void;
		};
	};
};

export declare type PopoverProps = typeof __propDef.props;
export declare type PopoverEvents = typeof __propDef.events;
export declare type PopoverSlots = typeof __propDef.slots;
export default class Popover extends SvelteComponentTyped<
	PopoverProps,
	PopoverEvents,
	PopoverSlots
> {}

export {};

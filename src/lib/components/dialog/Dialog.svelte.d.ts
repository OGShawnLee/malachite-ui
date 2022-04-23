import { SvelteComponentTyped } from 'svelte';
import type { Nullable, RenderElementTagName } from '$lib/types';
import type { Readable, Writable } from 'svelte/store';

declare const __propDef: {
	props: {
		[x: string]: any;
		open?: boolean | Writable<boolean> | undefined;
		initialFocus?: Readable<Nullable<HTMLElement>> | Nullable<HTMLElement>;
		class?: Nullable<string>;
		as?: RenderElementTagName | undefined;
		element?: HTMLElement | undefined;
		use?: [action: import('svelte/action').Action<HTMLElement, any>, parameter?: any][] | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		default: {
			overlay: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			dialog: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			content: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			title: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			description: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
			close: (ref?: HTMLElement | Event | undefined) => void;
		};
	};
};

export declare type DialogProps = typeof __propDef.props;
export declare type DialogEvents = typeof __propDef.events;
export declare type DialogSlots = typeof __propDef.slots;
export default class Dialog extends SvelteComponentTyped<DialogProps, DialogEvents, DialogSlots> {}

export {};

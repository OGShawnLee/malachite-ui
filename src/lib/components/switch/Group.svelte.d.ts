import { SvelteComponentTyped } from 'svelte';
import type { Nullable, RenderElementTagName } from '$lib/types';
import type { Readable, Writable } from 'svelte/store';

declare const __propDef: {
	props: {
		[x: string]: any;
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
		default: {
			isChecked: boolean;
			isDisabled: Nullable<boolean>;
			label: (
				element: HTMLElement,
				passive?: boolean
			) => {
				update: (passive?: boolean) => void;
				destroy: () => Promise<void>;
			};
			description: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
		};
	};
};

export declare type GroupProps = typeof __propDef.props;
export declare type GroupEvents = typeof __propDef.events;
export declare type GroupSlots = typeof __propDef.slots;
export default class Group extends SvelteComponentTyped<GroupProps, GroupEvents, GroupSlots> {}

export {};

import { SvelteComponentTyped } from 'svelte';
import type { ClassName, Nullable, RenderElementTagName } from '$lib/types';
import type { Readable } from 'svelte/store';

declare const __propDef: {
	props: {
		[x: string]: any;
		expanded?: boolean | Readable<boolean> | undefined;
		disabled?: Readable<Nullable<boolean>> | Nullable<boolean>;
		class?: ClassName<'isDisabled' | 'isOpen'>;
		as?: RenderElementTagName | undefined;
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
		default: {
			allClosed: boolean;
			allOpen: boolean;
			isOpen: boolean;
			isDisabled: Nullable<boolean>;
			overlay: (element: HTMLElement) => {
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

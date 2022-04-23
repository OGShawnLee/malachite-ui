import { SvelteComponentTyped } from 'svelte';
import type { Writable } from 'svelte/store';
import type { Nullable, RenderElementTagName } from '$lib/types';

declare const __propDef: {
	props: {
		[x: string]: any;
		checked?: boolean | Writable<boolean> | undefined;
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
		default: {
			isChecked: boolean;
			isDisabled: Nullable<boolean>;
			button: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
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

export declare type SwitchProps = typeof __propDef.props;
export declare type SwitchEvents = typeof __propDef.events;
export declare type SwitchSlots = typeof __propDef.slots;
export default class Switch extends SvelteComponentTyped<SwitchProps, SwitchEvents, SwitchSlots> {}

export {};

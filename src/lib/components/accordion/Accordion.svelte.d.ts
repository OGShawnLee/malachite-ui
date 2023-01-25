import { SvelteComponentTyped } from 'svelte';
import type { ClassName, Nullable, RenderElementTagName } from '$lib/types';

declare const __propDef: {
	props: {
		[x: string]: any;
		finite?: boolean;
		order?: boolean;
		class?: ClassName<'isOpen' | 'isDisabled'>;
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
			isOpen: boolean;
			isDisabled: boolean;
			accordion: (element: HTMLElement) => {
				destroy: () => Promise<void>;
			};
		};
	};
};

export declare type AccordionProps = typeof __propDef.props;
export declare type AccordionEvents = typeof __propDef.events;
export declare type AccordionSlots = typeof __propDef.slots;
export default class Accordion extends SvelteComponentTyped<
	AccordionProps,
	AccordionEvents,
	AccordionSlots
> {}

export {};

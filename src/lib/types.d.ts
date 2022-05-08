import type { Writable, Readable, Unsubscriber } from 'svelte/store';
import type { Action } from 'svelte/action';
import type { Ordered } from '$lib/stores/Ordered';

export type Collectable =
	| Unsubscriber
	| Nullable<boolean>
	| (() => Promise<Collectable>)
	| Promise<Collectable>
	| Collectable[]
	| { destroy: Collectable }
	| void;

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type ExtractContext<C, K extends keyof C> = OmitAllThisParameter<Pick<C, K>>;

export namespace Forwarder {
	export type Actions = [action: Action, parameter?: any][];

	interface BuiltAction {
		action: Action;
		update?: (argument: unknown) => void;
		destroy?: () => void;
		parameter?: unknown;
	}
}

export namespace Navigable {
	export interface HandlerCallbackContext<K = NavigationKey> {
		code: K | 'Enter' | 'Space';
		event: KeyboardEvent;
		ctrlKey: boolean;
	}

	export interface Item {
		readonly Index: Writable<number>;
	}

	export interface Member extends Item {
		readonly Selected: Writable<boolean>;
		readonly Active: Writable<boolean>;
		readonly element: HTMLElement;
		isDisabled: Nullable<boolean>;
	}

	export type Options<T> = {
		Index?: Writable<number> | number;
		Manual?: Readable<boolean> | boolean;
		Vertical?: Readable<boolean> | boolean;
		ShouldWait?: Readable<boolean> | boolean;
		Finite?: Readable<boolean> | boolean;
		shouldFocus?: boolean;
		startAt?: StartAt;
	} & { Ordered: Ordered<T & Member> };

	interface Primitive<T> {
		active: [HTMLElement, T & Member] | undefined;
		elements: HTMLElement[];
		index: number;
		isFinite: boolean;
		isManual: boolean;
		isVertical: boolean;
		isWaiting: boolean;
		manualIndex: number;
		selected: [HTMLElement, T & Member] | undefined;
	}

	export type StartAt = 'AUTO' | 'FIRST' | 'LAST' | number;
}

export type NavigationKey =
	| 'ArrowUp'
	| 'ArrowRight'
	| 'ArrowLeft'
	| 'ArrowDown'
	| 'Enter'
	| 'Home'
	| 'End'
	| 'Space';

export type Nullable<T> = T | null | undefined;

export type NullableRecursively<T> = T extends infer O
	? {
			[P in keyof O]?: O[P] extends (...args: any) => any
				? O[P] | null | undefined
				: O[P] extends object
				? ?Expand<NullableRecursively<O[P]>>
				: O[P] | null | undefined;
	  }
	: Nullable<T>;

export type OmitAllThisParameter<T> = {
	[P in keyof T]: OmitThisParameter<T[P]>;
};

export type Optional<T> = {
	[P in keyof T]?: T[P];
};

export type RenderElementTagName = keyof HTMLElementTagNameMap | 'slot';

export type Store<S> = [S] extends [Readable<infer V>]
	? {
			sync(this: void, configuration: { previous: V; value: Readable<V> | V }): void;
	  } & S
	: {
			sync(this: void, configuration: { previous: S; value: Readable<S> | S }): void;
	  } & Writable<S>;

// * -> useClassNameResolver

declare type ClassName<S extends ComponentStates> = Nullable<
	string | ClassNameObject<S> | FunctionClassName<S>
>;

export type ClassNameObject<S extends ComponentStates = ComponentStates> = NullableRecursively<{
	active: string | SwitchClassName;
	base: string | FunctionClassName<S> | ClassNameObject<S>;
	checked: string | SwitchClassName;
	disabled: string;
	dual: string; // isActive && isSelected || isActive && isChecked || isChecked && isSelected
	triple: string; // isActive && isChecked && isSelected
	open: string | SwitchClassName;
	selected: string | SwitchClassName;
}>;

declare type ComponentState<S extends ComponentStates = ComponentStates> = Expand<
	Record<S, boolean>
>;

declare type FunctionClassName<S extends ComponentStates> = (
	state: ComponentState<S>
) => Nullable<string>;

declare type ComponentStates = 'isActive' | 'isChecked' | 'isDisabled' | 'isOpen' | 'isSelected';

export type SwitchClassName = Expand<NullableRecursively<{ on: string; off: string }>>;

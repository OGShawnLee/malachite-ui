import type { Writable, Readable, Unsubscriber } from 'svelte/store';
import type { Ordered, Toggleable } from '$lib/stores';
import type { ElementBinder } from '$lib/core';
import type { ToggleableGroup } from './stores/Toggleable';

export interface Action {
	(element: HTMLElement): void | { destroy?: Unsubscriber };
}

export interface ActionComponent<T = void> {
	action: (element: HTMLElement) => {
		destroy: Unsubscriber;
	};
	binder: ElementBinder;
	context: T;
}

export type Collectable =
	| Unsubscriber
	| Nullable<boolean>
	| Collectable[]
	| { destroy: Collectable }
	| void;

type ComponentTagName = keyof HTMLElementTagNameMap | 'fragment';

interface ComponentInitialiser<T = void> {
	(id: string | undefined): ActionComponent<T>;
}

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type ExtractContext<C, K extends keyof C> = OmitAllThisParameter<Pick<C, K>>;

export type ExtractContextKeys<T> = { [P in keyof T]: any };

export namespace Navigable {
	export interface HandlerCallbackContext {
		code: NavigationKey;
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
		shouldWait: boolean;
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
				? Expand<NullableRecursively<O[P]>>
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

export interface Ref<T> extends Writable<T> {
	value: T;
}

declare type Refs =
	| ReadableRef<any>
	| [ReadableRef<any>, ...Array<ReadableRef<any>>]
	| Array<ReadableRef<any>>;

export interface ReadableRef<T> extends Readable<T> {
	readonly value: T;
}

export interface ReadableWrapper<T> extends Readable<T> {
	sync: SyncFunction<T>;
}

export type Store<S> = [S] extends [Readable<infer V>]
	? {
			sync(this: void, configuration: { previous: V; value: Readable<V> | V }): void;
	  } & S
	: {
			sync(this: void, configuration: { previous: S; value: Readable<S> | S }): void;
	  } & Writable<S>;

export type StoreValue<Union> = Union extends Readable<infer Value> ? Value : Union;

declare type StoresValues<T> = T extends Readable<infer U>
	? U
	: {
			[K in keyof T]: T[K] extends Readable<infer U> ? U : never;
	  };

declare type SyncFunction<T> = (
	this: void,
	configuration: { previous: T; current: T | Readable<T> }
) => void;

export namespace Toggler {
	export interface Settings {
		isOpen?: boolean;
		isFocusForced?: boolean;
		group?: ToggleableGroup;
	}

	export interface Plugin {
		(this: Toggleable, element: HTMLElement): Unsubscriber;
	}

	export interface ButtonOptions {
		plugins?: Array<Plugin>;
		isToggler?: boolean;
	}

	export interface PanelOptions {
		plugins?: Array<Plugin>;
		onOpen?: (panel: HTMLElement) => void;
	}
}

export interface WritableWrapper<T> extends Writable<T> {
	sync: SyncFunction<T>;
}

// --> ClassName Resolver
type ClassName<S extends ComponentState> = Nullable<
	| FunctionClassName<S>
	| string
	| ({
			base?: Nullable<string>;
	  } & {
			[P in S as Lowercase<P>]?: Nullable<string | SwitchClassName>;
	  })
>;

type ComponentState = 'ACTIVE' | 'CHECKED' | 'DISABLED' | 'OPEN' | 'PRESSED' | 'SELECTED';

interface FunctionClassName<S extends ComponentState> {
	(predicate: StatePredicate<S>): Nullable<string>;
}

type PredicateString<K extends string> = `is${Capitalize<Lowercase<K>>}`;

type StatePredicate<T extends ComponentState> = {
	[P in T as PredicateString<P>]: boolean;
};

interface SwitchClassName {
	on?: string;
	off?: string;
}

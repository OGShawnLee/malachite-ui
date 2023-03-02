import type { Writable, Readable, Unsubscriber } from 'svelte/store';
import type { Navigable, Toggleable } from '$lib/stores';
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

interface ComponentInitialiserStrict<T = void> {
	(id: string | undefined, binder: ElementBinder): ActionComponent<T>;
}

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type ExtractContext<C, K extends keyof C> = OmitAllThisParameter<Pick<C, K>>;

export type ExtractContextKeys<T> = { [P in keyof T]: any };

export namespace Navigation {
	type Directions = 'BACK' | 'NEXT';

	interface FinderSettings {
		direction: Directions | 'BOUNCE';
		edge?: boolean;
		index?: number;
	}

	export type Handler = (this: Navigable, event: KeyboardEvent) => void;

	interface Item {
		binder: ElementBinder;
		disabled: Nullable<boolean>;
		element?: HTMLElement;
		index: number;
		isActive: boolean;
		isSelected: boolean;
	}

	export interface RootSettings {
		handler?: Handler;
		plugins?: Plugin<Navigable>[];
	}

	export interface Settings {
		initialIndex?: number;
		isDisabled?: boolean;
		isFinite?: boolean;
		isFocusEnabled?: boolean;
		isGlobal?: boolean;
		isManual?: boolean;
		isVertical?: boolean;
		isWaiting?: boolean;
	}
}

type KeyBack = 'ArrowUp' | 'ArrowLeft' | 'Home';

type KeyNext = 'ArrowDown' | 'ArrowRight' | 'End';

type NavigationKey = KeyBack | KeyNext | 'Enter' | 'Space';

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

export type Plugin<T extends object> = (this: T, element: HTMLElement) => Unsubscriber;

export type RenderElementTagName = keyof HTMLElementTagNameMap | 'slot';

export interface Ref<T> extends Writable<T> {
	value(this: void): T;
}

declare type Refs =
	| ReadableRef<any>
	| [ReadableRef<any>, ...Array<ReadableRef<any>>]
	| Array<ReadableRef<any>>;

export interface ReadableRef<T> extends Readable<T> {
	value(): T;
}

export type StoreValue<Union> = Union extends Readable<infer Value> ? Value : Union;

declare type StoresValues<T> = T extends Readable<infer U>
	? U
	: {
			[K in keyof T]: T[K] extends Readable<infer U> ? U : never;
	  };

export interface Switch extends Ref<boolean> {
	toggle(this: void): void;
}

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

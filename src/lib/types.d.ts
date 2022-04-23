import type { Writable, Readable, Unsubscriber } from 'svelte/store';
import type { Action } from 'svelte/action';

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

export type Nullable<T> = T | null | undefined;

export type OmitAllThisParameter<T> = {
	[P in keyof T]: OmitThisParameter<T[P]>;
};

export type RenderElementTagName = keyof HTMLElementTagNameMap | 'slot';

export type Store<S> = [S] extends [Readable<infer V>]
	? {
			sync(this: void, configuration: { previous: V; value: Readable<V> | V }): void;
	  } & S
	: {
			sync(this: void, configuration: { previous: S; value: Readable<S> | S }): void;
	  } & Writable<S>;

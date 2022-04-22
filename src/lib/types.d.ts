import type { Writable, Readable, Unsubscriber } from 'svelte/store';
import type { Action } from 'svelte/action';

namespace Forwarder {
	type Actions = [action: Action, parameter?: any][];

	interface BuiltAction {
		action: Action;
		update?: (argument: unknown) => void;
		destroy?: () => void;
		parameter?: unknown;
	}
}

type Collectable =
	| Unsubscriber
	| Nullable<boolean>
	| (() => Promise<Collectable>)
	| Promise<Collectable>
	| Collectable[]
	| { destroy: Collectable }
	| void;

type Store<S> = [S] extends [Readable<infer V>]
	? {
			sync(this: void, configuration: { previous: V; value: Readable<V> | V }): void;
	  } & S
	: {
			sync(this: void, configuration: { previous: S; value: Readable<S> | S }): void;
	  } & Writable<S>;

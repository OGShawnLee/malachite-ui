import type { Action } from '$lib/types';
import type { Unsubscriber } from 'svelte/store';

interface CachedAction {
	destroy?: Unsubscriber;
}

class ActionForwarder {
	protected readonly element: HTMLElement;
	protected readonly cache = new Map<Action, CachedAction>();

	constructor(element: HTMLElement, actions: Action[]) {
		this.element = element;
		for (const action of actions) this.add(action);
	}

	protected add(action: Action) {
		const result = action(this.element);
		this.cache.set(action, { destroy: result?.destroy });
	}

	protected delete(action: Action) {
		const cached = this.cache.get(action);
		cached?.destroy?.();
	}

	onDestroy(this: ActionForwarder) {
		for (const action of this.cache.values()) action.destroy?.();
	}

	onUpdate(this: ActionForwarder, actions: Action[]) {
		const preservedActions = new Set<Action>();
		for (const action of actions) {
			if (this.isNewAction(action)) this.add(action);
			preservedActions.add(action);
		}
		for (const cachedAction of this.cache.keys()) {
			if (preservedActions.has(cachedAction)) continue;
			this.delete(cachedAction);
		}
	}

	protected isNewAction(action: Action) {
		return this.cache.has(action);
	}
}

export function forward(element: HTMLElement, actions: Action[]) {
	const forwarder = new ActionForwarder(element, actions);
	return {
		destroy: () => forwarder.onDestroy(),
		update: (actions: Action[]) => forwarder.onUpdate(actions)
	};
}

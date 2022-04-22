import type { Action } from 'svelte/action';
import type { Forwarder } from '$lib/types';
import { useCleanup } from '@hooks';

type BuiltAction = Forwarder.BuiltAction;

export default class ActionForwarder {
	protected builtActions: BuiltAction[];
	protected readonly element: HTMLElement;
	protected readonly hash: Map<Action, BuiltAction>;
	protected readonly keptActions: Set<Action>;

	constructor(element: HTMLElement, actions: [action: Action, parameter?: any][]) {
		this.hash = new Map();
		this.element = element;
		this.builtActions = this.initialiseActions(element, actions);
		this.keptActions = new Set();
	}

	protected initialiseActions(element: HTMLElement, actions: [action: Action, paramter?: any][]) {
		return actions.reduce((builtActions, [action, parameter]) => {
			const builtAction = { action, ...action(element, parameter), parameter };
			this.hash.set(action, builtAction);
			builtActions.push(builtAction);
			return builtActions;
		}, [] as BuiltAction[]);
	}

	protected addNewAction(action: Action, parameter?: any) {
		const builtAction = { action, ...action(this.element, parameter), parameter };
		this.hash.set(action, builtAction);
		this.builtActions.push(builtAction);
		this.keptActions.add(action);
	}

	protected deleteRemovedActions() {
		this.builtActions = this.builtActions.filter(({ action, destroy }) => {
			if (this.isKeptAction(action)) return true;

			destroy?.();
			this.hash.delete(action);
		});

		this.keptActions.clear();
	}

	protected handleNewActions(actions: [action: Action, parameter?: any][]) {
		actions.forEach(([action, parameter]) => {
			if (this.isNewAction(action)) return this.addNewAction(action, parameter);

			this.keptActions.add(action);
			const cachedAction = this.hash.get(action);
			if (cachedAction && this.isNewParameter(cachedAction, parameter)) {
				cachedAction.update?.(parameter);
				cachedAction.parameter = parameter;
			}
		});
	}

	protected isKeptAction(action: Action) {
		return this.keptActions.has(action);
	}

	protected isNewAction(action: Action) {
		return !this.hash.has(action);
	}

	protected isNewParameter(builtAction: BuiltAction, parameter?: any) {
		return builtAction.parameter !== parameter;
	}

	get update() {
		return (actions: [action: Action, parameter?: any][]) => {
			this.handleNewActions(actions);
			this.deleteRemovedActions();
		};
	}

	get destroy() {
		return () => useCleanup(this.builtActions)();
	}
}

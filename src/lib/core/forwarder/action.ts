import ActionForwarder from './ActionForwarder';
import type { Action } from 'svelte/action';

export function forwardActions(element: HTMLElement, actions: [action: Action, parameter?: any][]) {
	const { update, destroy } = new ActionForwarder(element, actions);
	return { update, destroy };
}

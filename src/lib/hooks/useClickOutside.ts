import type { Unsubscriber } from 'svelte/store';
import { isWithin } from '$lib/predicate';
import { useWindowListener } from './useWindowListener';

export function useClickOutside(
	element: HTMLElement,
	onClickOutside: (context: {
		element: HTMLElement;
		event: MouseEvent;
		target: EventTarget | null;
	}) => void
): Unsubscriber {
	return useWindowListener('click', (event) => {
		const { target } = event;
		if (isWithin(element, target)) return;
		onClickOutside({ element, event, target });
	});
}

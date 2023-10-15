import type { Unsubscriber } from 'svelte/store';
import useWindowListener from './useWindowListener';
import { isWithin } from '$lib/predicate';

export default function useClickOutside<T extends HTMLElement | HTMLElement[]>(
	element: T,
	onClickOutside: (context: { element: T; event: MouseEvent; target: EventTarget | null }) => void
): Unsubscriber {
	return useWindowListener('click', (event) => {
		if (event.defaultPrevented) return;
		const { target } = event;
		if (isWithin(element, target)) return;
		onClickOutside({ element, event, target });
	});
}

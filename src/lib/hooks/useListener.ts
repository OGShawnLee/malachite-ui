import type { Unsubscriber } from 'svelte/store';

export default function useListener<K extends keyof HTMLElementEventMap>(
	element: HTMLElement,
	type: K,
	callback: (this: HTMLElement, event: HTMLElementEventMap[K]) => void,
	options?: AddEventListenerOptions | boolean
): Unsubscriber {
	element.addEventListener(type, callback, options);
	return () => element.removeEventListener(type, callback, options);
}

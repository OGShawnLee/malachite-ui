export function useListener<K extends keyof HTMLElementEventMap>(
	element: HTMLElement,
	type: K,
	handler: (this: HTMLElement, event: HTMLElementEventMap[K]) => void,
	options: AddEventListenerOptions | boolean = false
) {
	element.addEventListener(type, handler, options);
	return () => element.removeEventListener(type, handler, options);
}
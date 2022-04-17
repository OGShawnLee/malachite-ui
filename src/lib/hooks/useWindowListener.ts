export function useWindowListener<K extends keyof WindowEventMap>(
	type: K,
	handler: (this: Window, event: WindowEventMap[K]) => void,
	options: AddEventListenerOptions | boolean = false
) {
	window.addEventListener(type, handler, options);
	return () => window.removeEventListener(type, handler, options);
}

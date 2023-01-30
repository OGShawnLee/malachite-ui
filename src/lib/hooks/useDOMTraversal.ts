import { isChildless } from '$lib/predicate';

export default function useDOMTraversal(
	container: HTMLElement,
	isValidElement: (element: HTMLElement) => unknown
) {
	if (isChildless(container)) return isValidElement(container) ? [container] : [];
	const children: HTMLElement[] = [];
	if (isValidElement(container)) children.push(container);
	for (const child of container.children) {
		if (child instanceof HTMLElement) children.push(...useDOMTraversal(child, isValidElement));
	}
	return children;
}

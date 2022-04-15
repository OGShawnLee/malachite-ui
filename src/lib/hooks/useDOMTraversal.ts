import { traverse } from '@utils';

export function useDOMTraversal(
	container: Element,
	predicate?: (element: Element, elements: Element[]) => unknown
) {
	if (predicate) {
		const elements: Element[] = [];
		for (const element of traverse(container)) {
			if (predicate(element, elements)) elements.push(element);
		}

		return elements;
	}

	return Array.from(traverse(container));
}

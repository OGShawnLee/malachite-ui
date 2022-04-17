import { isHTMLElement } from '$lib/predicate';

export function findElement(
	container: Document | HTMLElement,
	predicate: (node: HTMLElement) => unknown
): HTMLElement | undefined {
	if (!container.hasChildNodes) return;

	const children = Array.from(container.children);
	for (const child of children) {
		if (isHTMLElement(child)) {
			if (predicate(child)) return child;
			const match = findElement(child, predicate);
			if (match) return match;
		}
	}
}

export function setAttribute(
	node: HTMLElement,
	[attribute, value]: [string, string],
	options: {
		overwrite?: boolean;
		predicate?: (node: HTMLElement) => unknown;
	} = {}
) {
	const { predicate, overwrite } = options;
	const shouldSetAttribute = predicate?.(node) ?? true;
	if (shouldSetAttribute) {
		if (overwrite || !node.hasAttribute(attribute)) node.setAttribute(attribute, value);
	}
}

// Anish Kumar - 31 ago 2021 -> https://dev.to/anishkumar/applying-tree-traversal-algorithms-to-dom-14bl
export function* traverse(container: Element | undefined): Generator<Element, void, unknown> {
	if (!container) return;
	const children = Array.from(container.children);

	yield container;
	for (const element of children) {
		yield* traverse(element);
	}
}

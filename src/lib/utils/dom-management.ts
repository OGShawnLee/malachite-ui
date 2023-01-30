import type { Readable } from 'svelte/store';
import { isHTMLElement } from '$lib/predicate';
import { tick } from 'svelte';

export function findElement(
	container: HTMLElement,
	isTargetElement: (child: HTMLElement) => unknown
): HTMLElement | undefined {
	if (!container.hasChildNodes) return;
	const children = container.children;
	for (const child of children) {
		if (!isHTMLElement(child)) continue;
		if (isTargetElement(child)) return child;
		const element = findElement(child, isTargetElement);
		if (element) return element;
	}
}

export async function setAttribute(
	node: HTMLElement,
	[attribute, value]: [string, string],
	options: {
		overwrite?: boolean;
		predicate?: (node: HTMLElement) => unknown;
		tickCheck?: boolean;
	} = {}
) {
	const { predicate, overwrite, tickCheck = true } = options;
	const shouldSetAttribute = predicate?.(node) ?? true;
	if (shouldSetAttribute) {
		if (overwrite || !node.hasAttribute(attribute)) {
			node.setAttribute(attribute, value);
			if (tickCheck) {
				await tick();
				if (node.getAttribute(attribute) === value) return;
				node.setAttribute(attribute, value);
			}
		}
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

export function useHideScrollbar(Open: Readable<boolean>) {
	const body = document.body;
	const initialOverflow = body.style.overflow;
	return Open.subscribe((isOpen) => {
		body.style.overflow = isOpen ? 'hidden' : initialOverflow;
	});
}

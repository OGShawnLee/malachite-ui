import Initialiser from './Initialiser';
import type { Expand, Navigable, Nullable } from '$lib/types';
import type { Updater } from 'svelte/store';
import { useCollector, useDataSync } from '$lib/hooks';
import { isAround, isNotDisabled, isNumber, isWithin } from '$lib/predicate';

type Member = Expand<Navigable.Member>;

export default class Core<T> extends Initialiser<T> {
	constructor(Options: Navigable.Options<T>) {
		super(Options);
	}

	listen({ beforeIndexSelection }: { beforeIndexSelection?: (this: Core<T>) => void } = {}) {
		const sync = useDataSync(this.primitive);
		return useCollector({
			beforeInit: () => [
				sync(this.Ordered.Children, 'elements'),
				sync(this.Manual, 'isManual', (isManual) => {
					this.TargetIndex = this[isManual ? 'ManualIndex' : 'Index'];
				}),
				sync(this.Vertical, 'isVertical'),
				sync(this.Waiting, 'isWaiting'),
				sync(this.Finite, 'isFinite')
			],
			init: () => {
				beforeIndexSelection?.bind(this)();
				return [sync(this.Index, 'index'), sync(this.ManualIndex, 'manualIndex')];
			},
			afterInit: () => {
				return [sync(this.Active, 'active'), sync(this.Selected, 'selected')];
			}
		});
	}

	listenActive(
		callback?: (context: {
			active: [HTMLElement, T & Member] | undefined;
			previous: [HTMLElement, T & Member] | undefined;
		}) => void
	) {
		if (callback)
			return this.useListenMember('Active', (current, previous) => {
				callback({ active: current, previous });
			});

		return this.useListenMember('Active', () => {});
	}

	listenSelected(
		callback?: (context: {
			selected: [HTMLElement, T & Member] | undefined;
			previous: [HTMLElement, T & Member] | undefined;
		}) => void
	) {
		if (callback)
			return this.useListenMember('Selected', (current, previous) => {
				callback({ selected: current, previous });
			});

		return this.useListenMember('Selected', () => {});
	}

	indexOf(element: HTMLElement) {
		return this.primitive.elements.indexOf(element);
	}

	isOverflowed(direction: 'BACK' | 'NEXT') {
		const { length, manualIndex } = this;
		return { BACK: manualIndex - 1 < 0, NEXT: manualIndex + 1 >= length }[direction];
	}

	isSelected(value: number | HTMLElement) {
		if (isNumber(value)) {
			const element = this.Ordered.elementAt(value);
			return this.primitive.selected?.[0] === element;
		}

		return this.primitive.selected?.[0] === value;
	}

	isValidIndex(index: number) {
		const isWithinRange = isAround(index, { min: 0, max: this.length });
		if (!isWithinRange) return false;
		const element = this.primitive.elements[index];
		return element && isNotDisabled(element);
	}

	isWithin(target: Nullable<Node | EventTarget>) {
		return isWithin(this.primitive.elements, target);
	}

	protected useListenMember(
		target: 'Active' | 'Selected',
		callback: (
			current: [HTMLElement, T & Member] | undefined,
			previous: [HTMLElement, T & Member] | undefined
		) => void
	) {
		let previous: [HTMLElement, T & Member] | undefined;
		return this[target].subscribe((current) => {
			if (current?.[0] !== previous?.[0]) {
				callback(current, previous);
				current?.[1][target].set(true);
				previous?.[1][target].set(false);
			}
			previous = current;
		});
	}

	useValidIndex(updater: Updater<number>) {
		const index = updater(this.index);
		return index >= 0 ? index : this.manualIndex;
	}
}

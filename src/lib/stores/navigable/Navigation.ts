import Finder from './Finder';
import type { Navigable } from '$lib/types';
import type { Readable, Updater } from 'svelte/store';
import { useListener } from '$lib/hooks';
import { isFunction, isNavigationKey, isNullish, isServer, isStore } from '$lib/predicate';

export default class Navigation<T> extends Finder<T> {
	constructor(Options: Navigable.Options<T>) {
		super(Options);
	}

	get sync() {
		const isGoingBackwards = (previous: number, current: number) => current - previous < 0;
		const isGoingForwards = (previous: number, current: number) => current - previous > 0;
		const set = (index: number) => this.set(index, false);

		let previous = 0;

		return (configuration: { previous: number; value: number | Readable<number> }) => {
			const { value } = configuration;

			if (isNullish(value) || isServer() || isStore(value)) return;

			if (this.isValidIndex(value)) {
				previous = value;
				return this.Index.sync(configuration);
			}

			if (value <= 0) {
				return set((previous = this.findIndexFromStart()));
			}

			if (value >= this.length) {
				return set((previous = this.findIndexFromEnd()));
			}

			if (isGoingBackwards(previous, value)) {
				return set((previous = this.findIndexFromEnd(value)));
			}

			if (isGoingForwards(previous, value)) {
				return set((previous = this.findIndexFromStart(value)));
			}
		};
	}

	protected async focusElement(index: number, shouldFocus = true) {
		if (shouldFocus) this.primitive.elements.at(index)?.focus();
	}

	set(index: number, shouldFocus = true) {
		if (this.isValidIndex(index)) {
			this.Index.set(index);
			this.focusElement(index, shouldFocus);
		}
	}

	interact(action: number | Updater<number>) {
		this.TargetIndex.update((index) => {
			const nextIndex = isFunction(action) ? action(index) : action;
			this.focusElement(nextIndex);
			return nextIndex;
		});
	}

	navigate(direction: 'BACK' | 'NEXT', updater: (index: number, isOverflowed: boolean) => number) {
		this.interact((index) => {
			const newIndex = updater(index, this.isOverflowed(direction));
			if (this.isValidIndex(newIndex)) return newIndex;
			return this.findValidIndex({ direction, startAt: newIndex });
		});
	}

	goBack() {
		this.navigate('BACK', (index, isOverflowed) => {
			return isOverflowed ? this.Ordered.size - 1 : index - 1;
		});
	}

	goNext() {
		this.navigate('NEXT', (index, isOverflowed) => {
			return isOverflowed ? 0 : index + 1;
		});
	}

	goFirst() {
		this.interact(this.findValidIndex({ direction: 'BACK', furthest: true }));
	}

	goLast() {
		this.interact(this.findValidIndex({ direction: 'NEXT', furthest: true }));
	}

	handleNextKey(code: 'ArrowDown' | 'ArrowRight', ctrlKey = false) {
		if (this.isVertical) {
			return code === 'ArrowDown' && (ctrlKey ? this.goLast() : this.goNext());
		}

		if (code === 'ArrowRight') ctrlKey ? this.goLast() : this.goNext();
	}

	handleBackKey(code: 'ArrowUp' | 'ArrowLeft', ctrlKey = false) {
		if (this.isVertical) {
			return code === 'ArrowUp' && (ctrlKey ? this.goFirst() : this.goBack());
		}

		if (code === 'ArrowLeft') ctrlKey ? this.goFirst() : this.goBack();
	}

	static initNavigationHandler(
		parent: HTMLElement,
		callback: (context: Expand<Navigable.HandlerCallbackContext>) => void
	) {
		return useListener(parent, 'keydown', (event) => {
			if (!isNavigationKey(event.code)) return;
			callback({ event, code: event.code, ctrlKey: event.ctrlKey });
		});
	}
}

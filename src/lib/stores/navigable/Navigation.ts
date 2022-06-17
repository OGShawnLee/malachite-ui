import Finder from './Finder';
import type { Navigable, Ref } from '$lib/types';
import type { Readable, Updater } from 'svelte/store';
import { useCleanup, useListener, useWindowListener } from '$lib/hooks';
import { isFunction, isNavigationKey, isNullish, isServer, isStore } from '$lib/predicate';
import { ref } from '$lib/utils';

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

	protected async focusElement(index: number, shouldFocus = this.shouldFocus) {
		if (shouldFocus) this.primitive.elements.at(index)?.focus();
	}

	hardSet(index: number, shouldFocus = true) {
		this.Index.set(index);
		this.focusElement(index, shouldFocus);
	}

	set(index: number, shouldFocus = true) {
		if (this.isValidIndex(index)) {
			this.Index.set(index);
			this.focusElement(index, shouldFocus);
		}

		this.Waiting.set(false);
	}

	interact(action: number | Updater<number>, focus = this.shouldFocus) {
		this.TargetIndex.update((index) => {
			const nextIndex = isFunction(action) ? action(index) : action;
			this.focusElement(nextIndex, focus);
			return nextIndex;
		});

		if (this.isManual) return;
		this.Waiting.set(false);
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
			if (isOverflowed && this.isFinite) return index;
			return isOverflowed ? this.Ordered.size - 1 : index - 1;
		});
	}

	goNext() {
		this.navigate('NEXT', (index, isOverflowed) => {
			if (isOverflowed && this.isFinite) return index;
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
			if (code !== 'ArrowDown') return;
			if (this.isWaiting) return ctrlKey ? this.goLast() : this.goFirst();

			return ctrlKey ? this.goLast() : this.goNext();
		}

		if (code !== 'ArrowRight') return;
		if (this.isWaiting) return ctrlKey ? this.goLast() : this.goFirst();

		ctrlKey ? this.goLast() : this.goNext();
	}

	handleBackKey(code: 'ArrowUp' | 'ArrowLeft', ctrlKey = false) {
		if (this.isVertical) {
			if (code !== 'ArrowUp') return;
			if (this.isWaiting) return ctrlKey ? this.goFirst() : this.goLast();

			return ctrlKey ? this.goFirst() : this.goBack();
		}

		if (code !== 'ArrowLeft') return;
		if (this.isWaiting) return ctrlKey ? this.goFirst() : this.goLast();

		ctrlKey ? this.goFirst() : this.goBack();
	}

	handleStartAt() {
		const startAt = this.startAt;
		switch (startAt) {
			case 'AUTO':
				return;
			case 'FIRST':
				return this.goFirst();
			case 'LAST':
				return this.goLast();
			default:
				const isValidIndex = this.isValidIndex(startAt);
				return isValidIndex
					? this.set(startAt, false)
					: this.findValidIndex({ direction: 'BOUNCE', startAt });
		}
	}

	initNavigationHandler(configuration: {
		parent: HTMLElement;
		isWindowNavigation?: Ref<boolean>;
		callback:
			| ((
					this: Navigation<unknown>,
					context: Expand<Navigable.HandlerCallbackContext> & { isWindowNavigation: boolean }
			  ) => void)
			| {
					local: (
						this: Navigation<unknown>,
						context: Expand<Navigable.HandlerCallbackContext>
					) => void;
					window: (
						this: Navigation<unknown>,
						context: Expand<Navigable.HandlerCallbackContext>
					) => void;
			  };
	}) {
		const { callback, isWindowNavigation = ref(false), parent } = configuration;

		if (isFunction(callback)) {
			const finalCallback = callback.bind(this);
			return useCleanup(
				isWindowNavigation.listen(),
				useListener(parent, 'keydown', (event) => {
					if (isWindowNavigation.value || !isNavigationKey(event.code)) return;
					finalCallback({
						event,
						code: event.code,
						ctrlKey: event.ctrlKey,
						isWindowNavigation: isWindowNavigation.value
					});
				}),
				useWindowListener('keydown', (event) => {
					if (!isWindowNavigation.value || !isNavigationKey(event.code)) return;
					finalCallback({
						event,
						code: event.code,
						ctrlKey: event.ctrlKey,
						isWindowNavigation: isWindowNavigation.value
					});
				})
			);
		}

		const { window: windowCallback, local: localCallback } = callback;
		const wCallback = windowCallback.bind(this);
		const lCallback = localCallback.bind(this);
		return useCleanup(
			isWindowNavigation.listen(),
			useWindowListener('keydown', (event) => {
				if (!isWindowNavigation.value || !isNavigationKey(event.code)) return;
				wCallback({ event, code: event.code, ctrlKey: event.ctrlKey });
			}),
			useListener(parent, 'keydown', (event) => {
				if (isWindowNavigation.value || !isNavigationKey(event.code)) return;
				lCallback({ event, code: event.code, ctrlKey: event.ctrlKey });
			})
		);
	}
}

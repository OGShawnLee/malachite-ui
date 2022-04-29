import type { Expand, NavigationKey, Nullable, Store } from '$lib/types';
import type { Writable, Readable, Updater, Unsubscriber } from 'svelte/store';
import { type Bridge, Ordered, storable } from '$lib/stores';
import { useCollector, useDataSync, useListener } from '$lib/hooks';
import { derived, writable } from 'svelte/store';
import { findIndex, findLastIndex, makeUnique } from '$lib/utils';
import { tick } from 'svelte';
import {
	isAround,
	isFunction,
	isNavigationKey,
	isNotDisabled,
	isNullish,
	isNumber,
	isServer,
	isStore
} from '$lib/predicate';

class Core<T> {
	protected readonly Index: Store<number>;
	protected readonly Manual: Readable<boolean>;
	protected readonly ManualIndex: Writable<number>;
	protected readonly Ordered: Ordered<T & Member>;
	protected readonly Vertical: Readable<boolean>;
	protected TargetIndex: Writable<number>;

	readonly Active: Readable<undefined | [HTMLElement, T & Member]>;
	readonly Selected: Readable<undefined | [HTMLElement, T & Member]>;

	protected readonly primitive: {
		elements: HTMLElement[];
		index: number;
		isManual: boolean;
		isVertical: boolean;
		manualIndex: number;
		active: [HTMLElement, T & Member] | undefined;
		selected: [HTMLElement, T & Member] | undefined;
	} = {
		elements: [],
		index: 0,
		isManual: false,
		isVertical: false,
		manualIndex: 0,
		active: undefined,
		selected: undefined
	};

	constructor({ Index, Manual, Vertical, Ordered }: Options<T>) {
		this.Index = storable({ Store: Index, initialValue: 0 });
		this.Manual = storable({ Store: Manual, initialValue: false });
		this.ManualIndex = writable(0, this.Index.subscribe);
		this.Vertical = storable({ Store: Vertical, initialValue: false });
		this.Ordered = Ordered;
		this.TargetIndex = this.Index;

		this.Active = this.deriveMember('ManualIndex');
		this.Selected = this.deriveMember('Index');
	}

	protected deriveMember(Index: 'Index' | 'ManualIndex') {
		return derived([this[Index], this.Ordered.Members], ([index, members]) => {
			const member = members.at(index);
			if (!member || member.isDisabled) return;
			return [member.element, member] as [HTMLElement, T & Navigable.Member];
		});
	}

	get subscribe() {
		return this.Index.subscribe;
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

	listen(): () => Promise<void> {
		const sync = useDataSync(this.primitive);
		return useCollector({
			init: () => {
				return [
					sync(this.Index, 'index'),
					sync(this.Manual, 'isManual', (isManual) => {
						this.TargetIndex = this[isManual ? 'ManualIndex' : 'Index'];
					}),
					sync(this.ManualIndex, 'manualIndex'),
					sync(this.Vertical, 'isVertical'),
					sync(this.Ordered.Children, 'elements')
				];
			},
			// ! async await here will crash TypeScript compiler on npm run package
			// took a while to finally find the problem... all tests are still fine :)
			afterInit: () => {
				tick().then(() => {
					if (!this.isValidIndex(this.index)) {
						this.set(this.findValidIndex({ direction: 'BOUNCE', startAt: this.index }), false);
					}
				});
				return [sync(this.Active, 'active'), sync(this.Selected, 'selected')];
			}
		});
	}

	listenActive(
		callback: (context: {
			active: [HTMLElement, T & Member] | undefined;
			previous: [HTMLElement, T & Member] | undefined;
		}) => void
	) {
		return this.useListenMember('Active', (current, previous) => {
			callback({ active: current, previous });
		});
	}

	listenSelected(
		callback: (context: {
			selected: [HTMLElement, T & Member] | undefined;
			previous: [HTMLElement, T & Member] | undefined;
		}) => void
	) {
		return this.useListenMember('Selected', (current, previous) => {
			callback({ selected: current, previous });
		});
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

	findIndexFromEnd(index = this.length - 1) {
		return findLastIndex(this.primitive.elements, isNotDisabled, index);
	}

	findIndexFromStart(index = 0) {
		return findIndex(this.primitive.elements, isNotDisabled, index);
	}

	findValidIndex(options: {
		direction: 'BACK' | 'NEXT' | 'BOUNCE';
		furthest?: boolean;
		startAt?: number;
	}) {
		const { direction, furthest, startAt = this.manualIndex } = options;
		return this.useValidIndex(() => {
			switch (direction) {
				case 'BACK':
					if (furthest) return this.findIndexFromStart();
					const previous = this.findIndexFromEnd(startAt - 1);
					if (previous > -1) return previous;
					return this.findIndexFromEnd();
				case 'NEXT':
					if (furthest) return this.findIndexFromEnd();
					const next = this.findIndexFromStart(startAt + 1);
					if (next > -1) return next;
					return this.findIndexFromStart();
				default:
					const validIndex = this.findIndexFromStart(startAt + 1);
					return validIndex >= 0 ? validIndex : this.findIndexFromEnd(startAt - 1);
			}
		});
	}

	isOverflowed(direction: 'BACK' | 'NEXT') {
		const { manualIndex, length } = this;
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

	static initNavigationHandler(
		parent: HTMLElement,
		callback: (context: Expand<HandlerCallbackContext>) => void
	) {
		return useListener(parent, 'keydown', (event) => {
			if (!isNavigationKey(event.code)) return;
			callback({ event, code: event.code, ctrlKey: event.ctrlKey });
		});
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

	get index() {
		return this.primitive.index;
	}

	get isManual() {
		return this.primitive.isManual;
	}

	get isVertical() {
		return this.primitive.isVertical;
	}

	get length() {
		return this.Ordered.size;
	}

	get manualIndex() {
		return this.primitive.manualIndex;
	}
}

export class Navigable<T = {}> extends Core<T> {
	constructor(options: Options<T>) {
		super(options);
	}

	protected add(
		element: HTMLElement,
		{ Bridge, Value }: { Bridge: Bridge; Value: T & Omit<Navigable.Item, 'element'> }
	) {
		const { Active, Selected, isDisabled } = Bridge;
		return this.Ordered.add(element, { Active, Selected, isDisabled, element, ...Value });
	}

	initNavigation(
		parent: HTMLElement,
		options: {
			handler?: (this: Navigable, parent: HTMLElement) => Unsubscriber;
			plugins?: Array<(this: Navigable, parent: HTMLElement) => Unsubscriber>;
		} = {}
	): () => Promise<void> {
		const { handler, plugins = [] } = options;
		return useCollector({
			init: () => [this.Ordered.initOrdering(parent), this.listen()],
			afterInit: () => {
				return [
					handler?.bind(this)(parent),
					makeUnique(plugins).map((plugin) => plugin.bind(this)(parent))
				];
			}
		});
	}

	initItem(element: HTMLElement, { Bridge, Value }: { Bridge: Bridge; Value: T & Navigable.Item }) {
		const set = (index: number) => this.set(index, false);
		const { Index } = this.add(element, { Bridge, Value });
		let index = 0;
		return useCollector({
			beforeCollection: async () => {
				this.Ordered.delete(element);
				await tick();
				if (this.index >= this.length) {
					set(this.findValidIndex({ direction: 'BACK' }));
				}
			},
			init: () => [
				Index.subscribe((currentIndex) => {
					index = currentIndex;
				}),
				Bridge.Disabled.subscribe((isDisabled) => {
					this.Ordered.update(element, (member) => {
						return { ...member, isDisabled };
					});
					if (isDisabled && this.isSelected(element)) {
						set(this.findValidIndex({ direction: 'BOUNCE', startAt: index }));
					}
				}),
				useListener(element, 'click', () => this.set(index))
			]
		});
	}
}

type Options<T> = Expand<Navigable.Options<T>>;
type Member = Expand<Navigable.Member>;

export interface HandlerCallbackContext<K = NavigationKey> {
	code: K | 'Enter' | 'Space';
	event: KeyboardEvent;
	ctrlKey: boolean;
}

export namespace Navigable {
	export interface Item {
		readonly Index: Writable<number>;
	}

	export interface Member extends Item {
		readonly Selected: Writable<boolean>;
		readonly Active: Writable<boolean>;
		readonly element: HTMLElement;
		isDisabled: Nullable<boolean>;
	}

	export type Options<T> = {
		Index?: Writable<number> | number;
		Manual?: Readable<boolean> | boolean;
		Vertical?: Readable<boolean> | boolean;
	} & { Ordered: Ordered<T & Member> };
}

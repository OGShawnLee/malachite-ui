import type { ElementBinder } from '$lib/core';
import type { KeyBack, KeyNext, Navigation, Plugin, ReadableRef, Ref } from '$lib/types';
import type { Updater } from 'svelte/store';
import Hashable from './Hashable';
import { findIndex, findLastIndex, ref } from '$lib/utils';
import { handleNavigation } from '$lib/plugins';
import { hasTagName, isAround, isDisabled, isFocusable, isNumber, isWithin } from '$lib/predicate';
import { onDestroy } from 'svelte';
import { derived } from 'svelte/store';
import { useCleanup, useCollector, useListener, useWindowListener } from '$lib/hooks';
import { createDerivedRef } from '$lib/utils';

export default class Navigable<T extends Navigation.Item = Navigation.Item> {
	readonly index: Ref<number>;
	readonly manualIndex: Ref<number>;
	readonly targetIndexRef: ReadableRef<Ref<number>>;
	readonly isDisabled: Ref<boolean>;
	readonly isFinite: Ref<boolean>;
	readonly isGlobal: Ref<boolean>;
	readonly isManual: Ref<boolean>;
	readonly isVertical: Ref<boolean>;
	readonly isWaiting: Ref<boolean>;
	readonly isFocusEnabled: Ref<boolean>;
	protected readonly items = new Hashable<string, T>({ entries: false, keys: false });
	protected readonly elements: HTMLElement[] = [];
	readonly active: ReadableRef<T | undefined>;
	readonly selected: ReadableRef<T | undefined>;

	constructor(settings: Navigation.Settings = {}) {
		this.index = ref(settings.initialIndex ?? 0);
		this.manualIndex = ref(settings.initialIndex ?? 0, this.index.subscribe);
		this.isDisabled = ref(settings.isDisabled ?? false);
		this.isFinite = ref(settings.isFinite ?? false);
		this.isFocusEnabled = ref(settings.isFocusEnabled ?? true);
		this.isGlobal = ref(settings.isGlobal ?? false);
		this.isManual = ref(settings.isManual ?? false);
		this.isVertical = ref(settings.isVertical ?? false);
		this.isWaiting = ref(settings.isWaiting ?? false);
		this.targetIndexRef = createDerivedRef(this.isManual, (isManual) => {
			return isManual ? this.manualIndex : this.index;
		});
		this.active = createDerivedRef([this.items.values, this.isWaiting], ([items, isWaiting]) => {
			if (isWaiting) return;
			return items.find((item) => item.isActive);
		});
		this.selected = createDerivedRef([this.items.values, this.isWaiting], ([items, isWaiting]) => {
			if (isWaiting) return;
			return items.find((item) => item.isSelected);
		});
	}

	get isAutomatic() {
		return !this.isManual.value;
	}

	get isHorizontal() {
		return !this.isVertical.value;
	}

	get size() {
		return this.items.size;
	}

	get targetIndex() {
		return this.targetIndexRef.value;
	}

	initNavigation(this: Navigable, element: HTMLElement, settings: Navigation.RootSettings = {}) {
		const { handler = handleNavigation, plugins = [] } = settings;
		const onKeydown = handler.bind(this);
		return useCleanup(
			this.index.subscribe(this.manualIndex.set),
			useListener(element, 'keydown', (event) => {
				if (this.isDisabled.value || this.isGlobal.value) return;
				onKeydown(event);
			}),
			useWindowListener('keydown', (event) => {
				if (this.isDisabled.value) return;
				if (this.isGlobal.value) onKeydown(event);
			}),
			this.initialisePlugins(element, plugins)
		);
	}

	// RUNS WHEN COMPONENT IS INITIALISED
	onInitItem(
		this: Navigable<T>,
		name: string,
		binder: ElementBinder,
		item: Omit<T, keyof Navigation.Item>
	) {
		const index = this.items.size;
		if (this.items.has(name)) return index;
		const finalItem = {
			...item,
			binder,
			disabled: binder.disabled.value,
			index,
			isActive: false,
			isSelected: false
		};
		this.items.set(name, finalItem as T);
		binder.isSelected.value = this.isSelectedSSR(name);
		this.handleItemActiveState(index, binder, name);
		this.handleItemSelectedState(index, binder, name);
		onDestroy(() => {
			const index = this.elements.findIndex((element) => element === binder.element.value);
			this.elements.splice(index, 1);
			this.items.delete(name);
		});
		return index;
	}

	// RUNS WHEN ELEMENT IS MOUNTED
	initItem(this: Navigable, element: HTMLElement, name: string) {
		const { index } = this.items.getSafe(name);
		this.elements.push(element);
		this.items.update(name, (item) => {
			item.element = element;
			return item;
		});
		return this.addItemEventListeners(element, index);
	}

	createQuickItem(this: Navigable, element: HTMLElement) {
		const index = this.elements.push(element) - 1;
		return useCollector({
			beforeCollection: () => {
				const index = this.elements.indexOf(element);
				this.elements.splice(index, 1);
			},
			init: () => this.addItemEventListeners(element, index)
		});
	}

	protected handleItemActiveState(
		this: Navigable,
		index: number,
		binder: ElementBinder,
		name: string
	) {
		const isActive = derived([this.manualIndex, binder.disabled], ([manualIndex, isDisabled]) => {
			if (isDisabled) return false;
			return manualIndex === index;
		});
		onDestroy(
			isActive.subscribe((isActive) => {
				this.items.update(name, (item) => {
					item.isActive = binder.isActive.value = isActive;
					return item;
				});
			})
		);
	}

	protected handleItemSelectedState(
		this: Navigable,
		index: number,
		binder: ElementBinder,
		name: string
	) {
		const isSelected = derived(
			[this.index, binder.disabled, this.isWaiting],
			([globalIndex, isDisabled, isWaiting]) => {
				if (isWaiting || isDisabled) return false;
				return globalIndex === index;
			}
		);
		onDestroy(
			isSelected.subscribe((isSelected) => {
				this.items.update(name, (item) => {
					item.isSelected = binder.isSelected.value = isSelected;
					return item;
				});
			})
		);
	}

	protected addItemEventListeners(this: Navigable, element: HTMLElement, index: number) {
		const isButton = hasTagName(element, 'button');
		return useCollector({
			beforeInit: () => {
				if (isButton) return;
				return [
					useListener(element, 'mousedown', (event) => {
						if (isDisabled(element)) event.preventDefault(); // prevent focusing element
					}),
					useListener(element, 'keydown', (event) => {
						if (isDisabled(element) || this.isAutomatic) return;
						if (event.code === 'Enter' || event.code === 'Space') element.click();
					})
				];
			},
			init: () => [
				useListener(element, 'click', () => {
					this.set(index, false);
				}),
				useListener(element, 'focus', () => {
					if (this.isSelectedRuntime(element, index)) return;
					this.interact(index, false);
				})
			]
		});
	}

	at(this: Navigable, index: number) {
		return this.elements.at(index);
	}

	get(this: Navigable<T>, fn: (entry: { name: string; item: T }) => unknown) {
		for (const entry of this.items.hash.value) {
			const item = { name: entry[0], item: entry[1] };
			if (fn(item)) return item;
		}
		throw Error('Unable to Get Navigable Item');
	}

	update(this: Navigable<T>, name: string, callback: (item: T) => T) {
		this.items.update(name, callback);
	}

	set(this: Navigable, index: number, focus = true) {
		if (this.isValidIndex(index)) {
			this.index.value = index;
			this.isWaiting.value = false;
			if (this.isFocusEnabled.value && focus) this.elements.at(index)?.focus();
		}
	}

	interact(this: Navigable, index: number | Updater<number>, focus = true) {
		index = isNumber(index) ? index : index(this.targetIndex.value);
		if (this.isValidIndex(index)) {
			this.targetIndex.value = index;
			if (!this.isManual.value) this.isWaiting.set(false);
			if (this.isFocusEnabled.value && focus) {
				this.elements.at(this.targetIndex.value)?.focus();
			}
		}
	}

	go(
		this: Navigable,
		direction: Navigation.Directions,
		fn: (index: number, isOverflowed: boolean) => number
	) {
		this.interact((currentIndex) => {
			const index = fn(currentIndex, this.isOverflowed(direction));
			if (this.isValidIndex(index)) return index;
			return this.findValidIndex({ direction, index });
		});
	}

	goFirst(this: Navigable) {
		this.interact(this.findValidIndex({ direction: 'BACK', edge: true }));
	}

	goBack(this: Navigable) {
		this.go('BACK', (index, isOverflowed) => {
			if (isOverflowed && this.isFinite.value) return index;
			return isOverflowed ? this.elements.length - 1 : index - 1;
		});
	}

	goNext(this: Navigable) {
		this.go('NEXT', (index, isOverflowed) => {
			if (isOverflowed && this.isFinite.value) return index;
			return isOverflowed ? 0 : index + 1;
		});
	}

	goLast(this: Navigable) {
		this.interact(this.findValidIndex({ direction: 'NEXT', edge: true }));
	}

	findIndex(this: Navigable, fn: (element: HTMLElement, index: number) => unknown) {
		return this.elements.findIndex((element, index) => fn(element, index));
	}

	findValidIndex(
		this: Navigable,
		{ edge, direction, index = this.targetIndex.value }: Navigation.FinderSettings
	) {
		const defaultIndex = this.targetIndex.value;
		const isFocusable = Navigable.isFocusable;
		switch (direction) {
			case 'BACK':
				if (edge) return findIndex(this.elements, isFocusable);
				const previous = findLastIndex(this.elements, isFocusable, index - 1);
				if (previous > -1) return previous;
				return this.isFinite.value ? defaultIndex : findLastIndex(this.elements, isFocusable);
			case 'NEXT':
				if (edge) return findLastIndex(this.elements, isFocusable);
				const next = findIndex(this.elements, isFocusable, index + 1);
				if (next > -1) return next;
				return this.isFinite.value ? defaultIndex : findIndex(this.elements, isFocusable);
			case 'BOUNCE':
				const validIndex = findIndex(this.elements, isFocusable, index + 1);
				return validIndex > -1 ? validIndex : findIndex(this.elements, isFocusable);
		}
	}

	handleBackKey(this: Navigable, code: KeyBack, ctrlKey = false, directionSensitive = true) {
		if (code === 'Home') return this.goFirst();
		if (directionSensitive) {
			if (this.isVertical.value && code !== 'ArrowUp') return;
			if (this.isHorizontal && code !== 'ArrowLeft') return;
		}
		ctrlKey ? this.goFirst() : this.goBack();
	}

	handleNextKey(this: Navigable, code: KeyNext, ctrlKey = false, directionSensitive = true) {
		if (code === 'End') return this.goLast();
		if (directionSensitive) {
			if (this.isVertical.value && code !== 'ArrowDown') return;
			if (this.isHorizontal && code !== 'ArrowRight') return;
		}
		ctrlKey ? this.goLast() : this.goNext();
	}

	protected initialisePlugins(this: Navigable, element: HTMLElement, plugins: Plugin<Navigable>[]) {
		return plugins.map((plugin) => plugin.bind(this)(element));
	}

	static isFocusable(element: HTMLElement | EventTarget) {
		return isFocusable(element, false);
	}

	isNavigationElement(this: Navigable, element: HTMLElement) {
		return this.elements.includes(element);
	}

	isOverflowed(this: Navigable, direction: Navigation.Directions) {
		if (direction === 'BACK') return this.targetIndex.value - 1 < 0;
		return this.targetIndex.value + 1 === this.elements.length;
	}

	isSelectedSSR(this: Navigable, name: string) {
		if (this.isWaiting.value) return false;
		const { index, binder } = this.items.getSafe(name);
		return !binder.disabled && index === this.index.value;
	}

	isSelectedRuntime(this: Navigable, element: HTMLElement, index: number) {
		if (this.isWaiting.value || isDisabled(element)) return false;
		return index === this.index.value;
	}

	isValidIndex(this: Navigable, index: number) {
		if (!isAround(index, { min: 0, max: this.elements.length })) return false;
		const element = this.elements.at(index);
		return element ? Navigable.isFocusable(element) : false;
	}

	isWithin(this: Navigable, element: HTMLElement) {
		return isWithin(this.elements, element);
	}
}

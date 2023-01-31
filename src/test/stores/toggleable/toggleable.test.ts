import '@testing-library/jest-dom';
import { handleClickOutside, handleEscapeKey, handleFocusLeave } from '$lib/plugins';
import { Addons, Base as Component } from './samples';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/svelte';
import { isBoolean, isObject, isStore } from '$lib/predicate';
import { appendChild, useCleaner, waitAWhile } from '@test-utils';
import { get, writable } from 'svelte/store';
import { useDOMTraversal } from '$lib/hooks';
import { Toggleable } from '$lib/stores';

const { add, destroy } = useCleaner();
const Open = new Toggleable();

afterEach(() => {
	destroy(), Open.close(), cleanup();
});

it.skip('Should return a store', () => {
	expect(isStore(Open)).toBe(true);
});

it.skip('Should return a boolean store', () => {
	expect(isBoolean(get(Open))).toBe(true);
});

describe.skip('options', () => {
	describe.skip('Open', () => {
		it.skip('Should determine the store value if it is a boolean', () => {
			const First = new Toggleable({ Open: true });
			const Second = new Toggleable({ Open: false });
			expect(get(First)).toBe(true);
			expect(get(Second)).toBe(false);
		});

		it.skip('Should use the given store if given a writable', () => {
			const Open = writable(true);
			const First = new Toggleable({ Open });
			expect(get(First)).toBe(true);
		});

		it.skip('Should be false by default', () => {
			expect(get(new Toggleable())).toBe(false);
		});
	});

	describe.skip('initialValue', () => {
		it.skip('Should be used as the store value if Open is undefined', () => {
			const First = new Toggleable({ Open: undefined, initialValue: true });
			const Second = new Toggleable({ initialValue: true });
			expect(get(First)).toBe(true);
			expect(get(Second)).toBe(true);
		});

		it.skip('Should not be used as the store value is Open is a writable or a boolean value', () => {
			const First = new Toggleable({ Open: false, initialValue: true });
			const Second = new Toggleable({ Open: writable(false), initialValue: true });
			expect(get(First)).toBe(false);
			expect(get(Second)).toBe(false);
		});
	});

	describe.skip('notifier', () => {
		it.skip('Should make the store a notifiable store', () => {
			const notifier = vi.fn(() => {});
			const Open = new Toggleable({ notifier });

			Open.set(true);
			expect(notifier).toBeCalledTimes(1);
			expect(notifier).toBeCalledWith(true);

			Open.set(false);
			expect(notifier).toBeCalledTimes(2);
			expect(notifier).toBeCalledWith(false);

			Open.toggle();
			expect(notifier).toBeCalledTimes(3);
			expect(notifier).toBeCalledWith(true);
		});

		it.skip('Should work if given a writable', () => {
			const notifier = vi.fn(() => {});
			const Open = new Toggleable({ Open: writable(false), notifier });

			Open.set(true);
			expect(notifier).toBeCalledTimes(1);
			expect(notifier).toBeCalledWith(true);

			Open.set(false);
			expect(notifier).toBeCalledTimes(2);
			expect(notifier).toBeCalledWith(false);

			Open.toggle();
			expect(notifier).toBeCalledTimes(3);
			expect(notifier).toBeCalledWith(true);
		});
	});
});

describe.skip('ForceFocus', () => {
	const ForceFocus = writable(true);
	it.skip('Should focus the first focusable element inside the panel upon opening', async () => {
		const Open = new Toggleable({ ForceFocus });
		const { getByText } = render(Component, { props: { Open } });
		await act(() => Open.open());
		const element = getByText('Internal Ref');
		expect(element).toHaveFocus();
	});

	it.skip('Should close upon focusing the button when using handleFocusLeave handler', async () => {
		const Open = new Toggleable({ ForceFocus });
		render(Component, { props: { Open, handlers: [handleFocusLeave] } });
		await act(() => Open.open());
		const { button, panel } = Open.elements;
		expect(panel).toBeInTheDocument();

		await act(() => button?.focus());
		expect(panel).not.toBeInTheDocument();
	});

	it.skip('Should not prevent toggling the panel by clicking the button', async () => {
		const Open = new Toggleable({ ForceFocus });
		render(Component, { props: { Open, handlers: [handleFocusLeave] } });
		const { button } = Open.elements;
		await fireEvent.click(button!);
		const panel = Open.elements.panel;
		expect(panel).toBeInTheDocument();

		await fireEvent.click(button!);
		expect(panel).not.toBeInTheDocument();
	});

	it.skip('Should not prevent focusing a reference upon closing', async () => {
		const Open = new Toggleable({ ForceFocus });
		const { getByText } = render(Component, { props: { Open, handlers: [handleFocusLeave] } });
		const ref = getByText('Ref');
		await act(() => Open.open());
		const { panel } = Open.elements;

		await act(() => Open.close(ref));
		expect(ref).toHaveFocus();
		expect(panel).not.toBeInTheDocument();
	});

	it.skip('Should not prevent the button from having focus upon closing by click', async () => {
		const Open = new Toggleable({ ForceFocus });
		const { getByText } = render(Component, { props: { Open, handlers: [handleFocusLeave] } });
		const button = getByText('Button');
		await fireEvent.click(button);
		const panel = getByText('Panel');

		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
		expect(button).toHaveFocus();
	});
});

describe.skip('open', () => {
	it.skip('Should set the store to true', () => {
		expect(Open.open());
		expect(get(Open)).toBe(true);
	});
});

describe.skip('close', () => {
	const Open = new Toggleable({ initialValue: true });
	it.skip('Should set the store to false', () => {
		Open.close();
		expect(get(Open)).toBe(false);
	});
});

describe.skip('close', () => {
	const Open = new Toggleable({ initialValue: true });
	it.skip('Should set the store to false', () => {
		Open.close();
		expect(get(Open)).toBe(false);
	});

	describe.skip('ref', () => {
		it.skip('Should focus the given ref', () => {
			const ref = appendChild(document.createElement('button'));
			const button = appendChild(document.createElement('button'));

			add(Open.button(button));
			Open.close(ref);
			expect(ref).toHaveFocus();
		});

		it.skip('Should focus the button if not given a ref', () => {
			const button = appendChild(document.createElement('button'));
			add(Open.button(button));
			Open.close();
			expect(button).toHaveFocus();
		});

		describe.skip('invalid', () => {
			it.skip('Should focus the button if the reference is inside the panel', async () => {
				const Open = new Toggleable({ initialValue: true });
				const { findByText } = render(Component, { props: { Open } });
				const ref = await findByText('Internal Ref');

				Open.close(ref);
				expect(Open.elements.button).toHaveFocus();
			});

			it.skip('Should focus the button if the ref is disabled', async () => {
				const Open = new Toggleable({ initialValue: true });
				const { findByText } = render(Component, { props: { Open } });
				const ref = await findByText('Invalid Disabled Ref');

				Open.close(ref);
				expect(Open.elements.button).toHaveFocus();
			});

			it.skip('Should focus the button if the ref is not focusable', async () => {
				const Open = new Toggleable({ initialValue: true });
				const { findByText } = render(Component, { props: { Open } });
				const ref = await findByText('Invalid Focusable Ref');

				Open.close(ref);
				expect(Open.elements.button).toHaveFocus();
			});
		});
	});
});

describe.skip('sync', () => {
	it.skip('Should have a sync method', () => {
		expect(Open).toHaveProperty('sync');
		expect(Open.sync).toBeInstanceOf;
	});
});

describe.skip('button', () => {
	describe.skip('#button', () => {
		it.skip('Should have a button method', () => {
			expect(Open).toHaveProperty('button');
			expect(Open.button).toBeInstanceOf(Function);
		});

		it.skip('Should return an unsubscriber', () => {
			const destroy = Open.button(document.createElement('button'));
			expect(destroy).toBeInstanceOf(Function);
			destroy();
		});

		it.skip('Should update the state with the given element', () => {
			const button = document.createElement('button');
			add(Open.button(button));
			expect(Open.elements.button).toBe(button);
		});

		it.skip('Should set the state button to undefined after calling the unsubscriber', () => {
			const button = document.createElement('button');
			const destroy = Open.button(button);
			expect(Open.elements.button).toBe(button);

			destroy();
			expect(Open.elements.button).toBe(undefined);
		});

		it.skip('Should add a click event listener that toggles the store', () => {
			const Open = new Toggleable({ initialValue: true });
			const button = document.createElement('button');
			add(Open.button(button));

			button.click();
			expect(Open.isOpen).toBe(false);

			button.click();
			expect(Open.isOpen).toBe(true);
		});

		describe.skip('attributes', () => {
			describe.skip('type', () => {
				it.skip('Should set type button if element is a button element', () => {
					const button = document.createElement('button');
					add(Open.button(button));
					expect(button).toHaveAttribute('type', 'button');
				});

				it.skip('Should not set type button if element has already a type', () => {
					const button = document.createElement('button');
					button.type = 'submit';
					add(Open.button(button));
					expect(button).toHaveAttribute('type', 'submit');
				});
			});

			describe.skip('role', () => {
				it.skip('Should set role button if element is not a button element', () => {
					const div = document.createElement('div');
					add(Open.button(div));
					expect(div).toHaveAttribute('role', 'button');
				});

				it.skip('Should not set role button if element has already a role', () => {
					const div = document.createElement('div');
					div.setAttribute('role', 'dialog');
					add(Open.button(div));
					expect(div).toHaveAttribute('role', 'dialog');
				});
			});
		});
	});
});

describe.skip('panel', () => {
	describe.skip('#panel', () => {
		it.skip('Should have a panel method', () => {
			expect(Open).toHaveProperty('panel');
			expect(Open.panel).toBeInstanceOf(Function);
		});

		it.skip('Should update the state with the given element', () => {
			const div = document.createElement('div');
			add(Open.panel(div));
			expect(Open.elements.panel).toBe(div);
		});

		it.skip('Should return an unsubscriber', () => {
			const destroy = Open.panel(document.createElement('div'));
			expect(destroy).toBeInstanceOf(Function);
			destroy();
		});

		/* 
			unstable because testing library does not destroy sometimes and prevent elements from 
			leaking into other tests and ruining them..
		*/
		describe.skip('options', () => {
			describe.skip('handlers', () => {
				const options = {
					panel: { handlers: [handleClickOutside, handleEscapeKey, handleFocusLeave] }
				};
				it.skip('Should add all the given handlers', async () => {
					const Open = new Toggleable({ initialValue: true });
					const { getByText } = render(Addons, { props: { Open, options } });
					const externalElement = getByText('External');

					externalElement.focus();
					expect(Open.isOpen).toBe(false);

					Open.open();
					await fireEvent.keyDown(window, { code: 'Escape' });
					expect(Open.isOpen).toBe(false);

					await act(() => Open.open());
					await fireEvent.click(externalElement);
					expect(Open.isOpen).toBe(false);
				});
			});
		});
	});
});

describe.skip('isOpen', () => {
	const Open = new Toggleable();
	it.skip('Should have an isOpen getter', () => {
		expect(Open).toHaveProperty('isOpen');
		expect(Open.isOpen).not.toBeInstanceOf(Function);
	});

	it.skip('Should return true if the store is open (true)', () => {
		add(Open.button(document.createElement('button')));
		expect(Open.isOpen).toBe(false);

		Open.set(true);
		expect(Open.isOpen).toBe(true);
	});
});

describe.skip('isClosed', () => {
	const Open = new Toggleable();
	it.skip('Should have an isClosed getter', () => {
		expect(Open).toHaveProperty('isClosed');
		expect(Open.isClosed).not.toBeInstanceOf(Function);
	});

	it.skip('Should return true if the store is closed (false)', () => {
		add(Open.button(document.createElement('button')));
		expect(Open.isClosed).toBe(true);

		Open.set(true);
		expect(Open.isClosed).toBe(false);
	});
});

describe.skip('elements', () => {
	it.skip('Should have an elements getter', () => {
		expect(Open).toHaveProperty('elements');
		expect(Open.elements).not.toBeInstanceOf(Function);
	});

	it.skip('Should return an object: { button, panel }', () => {
		expect(isObject(Open.elements, ['button', 'panel'])).toBe(true);
	});

	it.skip('Should return { button: undefined, panel: undefined } when initialised', () => {
		const Open = new Toggleable();
		expect(Open.elements.button).toBeUndefined();
		expect(Open.elements.panel).toBeUndefined();
	});

	it.skip('Should contain the current button and panel element', () => {
		const Open = new Toggleable();

		const button = document.createElement('button');
		const panel = document.createElement('div');
		const { destroy } = useCleaner(Open.button(button), Open.panel(panel));
		expect(Open.elements).toEqual({ button, panel });

		destroy();
		expect(Open.elements).toEqual({ button: undefined, panel: undefined });
	});
});

describe.skip('tuple', () => {
	it.skip('Should have a tuple getter', () => {
		expect(Open).toHaveProperty('tuple');
		expect(Open.tuple).not.toBeInstanceOf(Function);
	});

	it.skip('Should return a tuple of 2 items', () => {
		expect(Open.tuple).toBeInstanceOf(Array);
		expect(Open.tuple).toHaveLength(2);
	});

	it.skip('Should return [undefined, undefined] when initialised', () => {
		expect(Open.tuple).toEqual([undefined, undefined]);
	});

	it.skip('Should contain the current button and panel elements', () => {
		const Open = new Toggleable();

		const button = document.createElement('button');
		const panel = document.createElement('div');

		const { destroy } = useCleaner(Open.button(button), Open.panel(panel));
		expect(Open.tuple).toEqual([button, panel]);

		destroy();
		expect(Open.tuple).toEqual([undefined, undefined]);
	});
});

describe.skip('handlers', () => {
	const options = { panel: { handlers: [handleClickOutside] } };
	describe.skip('handleClickOutside', () => {
		it.skip('Should close by clicking outside the panel', async () => {
			const Open = new Toggleable({ initialValue: true });
			const { getByText } = render(Addons, { props: { Open, options } });
			const externalElement = getByText('External');

			expect(Open.isOpen).toBe(true);
			await fireEvent.click(externalElement);
			expect(Open.isOpen).toBe(false);
		});

		it.skip('Should not prevent opening by clicking the button', async () => {
			const Open = new Toggleable();
			const { getByText } = render(Addons, { props: { Open, options } });
			const button = getByText('Button');

			await fireEvent.click(button);
			expect(Open.isOpen).toBe(true);
		});

		it.skip('Should not close by clicking the panel or its children', async () => {
			const Open = new Toggleable({ initialValue: true });
			const { getByText } = render(Addons, { props: { Open, options } });
			const ref = getByText('Internal Ref');

			await fireEvent.click(ref);
			expect(Open.isOpen).toBe(true);
			await fireEvent.click(Open.elements.panel!);
			expect(Open.isOpen).toBe(true);
		});
	});

	describe.skip('handleEscapeKey', () => {
		const options = { panel: { handlers: [handleEscapeKey] } };
		it.skip('Should close by pressing Escape', async () => {
			const Open = new Toggleable({ initialValue: true });
			render(Addons, { props: { Open, options } });

			expect(Open.isOpen).toBe(true);
			await fireEvent.keyDown(window, { code: 'Escape' });
			expect(Open.isOpen).toBe(false);
		});
	});

	describe.skip('handleFocusLeave', () => {
		const options = { panel: { handlers: [handleFocusLeave] } };
		it.skip('Should close if the button or panel loses focus', async () => {
			const Open = new Toggleable({ initialValue: true });
			const { getByText } = render(Addons, { props: { Open, options } });
			const externalElement = getByText('External');

			externalElement.focus();
			expect(Open.isOpen).toBe(false);
		});

		it.skip('Should not close if the button or panel and its children are focused', () => {
			const Open = new Toggleable({ initialValue: true });
			const { getByText } = render(Addons, { props: { Open, options } });

			const button = getByText('Button');
			const panel = getByText('Panel');
			panel.tabIndex = 1;
			const panelChild = getByText('Internal Ref');

			button.focus();
			panel.focus();
			panelChild.focus();
			expect(Open.isOpen).toBe(true);
		});
	});
});

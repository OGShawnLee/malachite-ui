import '@testing-library/jest-dom';
import { ActionComponent, Render } from './samples';
import { Bridge } from '$lib/stores';
import { elementTagNames } from '$lib/components/render';
import { isStore, isWritable } from '$lib/predicate';
import { generateSpyFunctions, useCleaner } from '@test-utils';
import { get } from 'svelte/store';
import { act, render, waitFor } from '@testing-library/svelte';

const Element = new Bridge();
const { add, destroy } = useCleaner();
afterEach(() => destroy());

it.skip('Should return a store', () => {
	expect(isStore(Element)).toBe(true);
});

it.skip('Should subscribe to the current element', () => {
	const button = document.createElement('button');
	const dialog = document.createElement('dialog');

	const func = vi.fn(() => {});
	add(Element.subscribe(func));
	expect(func).toBeCalledTimes(1);
	expect(func).toBeCalledWith(undefined);

	const destroy = Element.onMount(button, 'awesome-button');
	expect(func).toBeCalledTimes(2);
	expect(func).toBeCalledWith(button);

	destroy();
	expect(func).toBeCalledTimes(3);
	expect(func).toBeCalledWith(undefined);

	add(Element.onMount(dialog, 'awesome-dialog'));
	expect(func).toBeCalledTimes(4);
	expect(func).toBeCalledWith(dialog);
});

describe.skip('arguments', () => {
	describe.skip('listen', () => {
		it.skip('Should be possible to listen the stores from the constructor', () => {
			const [first, second, third] = generateSpyFunctions(3);
			const Element = new Bridge(({ Name, Element, Active }) => [
				Name.subscribe(first),
				Element.subscribe(second),
				Active.subscribe(third)
			]);

			const button = document.createElement('button');
			add(Element.onMount(button, 'button-element'));

			expect(first).toBeCalledTimes(1);
			expect(first).toBeCalledWith('button-element');
			Element.Name.set('button-extreme');
			expect(first).toBeCalledTimes(2);
			expect(first).toBeCalledWith('button-extreme');

			expect(second).toBeCalledTimes(1);
			expect(second).toBeCalledWith(button);

			expect(third).toBeCalledTimes(1);
			expect(third).toBeCalledWith(false);
			Element.Active.set(true);
			expect(third).toBeCalledTimes(2);
			expect(third).toBeCalledWith(true);
		});

		const [first, second, third] = generateSpyFunctions(3);
		it.skip('Should pass the Bridge instance', async () => {
			const Agent = new Bridge(first);
			add(Agent.onMount(document.createElement('div'), 'div-element'));
			expect(first).toBeCalledWith(Agent);
		});

		it.skip('Should start listening once the element has been mounted', async () => {
			const Agent = new Bridge(({ Disabled }) => Disabled.subscribe(second));
			expect(second).not.toBeCalled();

			const button = document.createElement('button');
			add(Agent.onMount(button, 'button-element'));
			expect(second).toBeCalledTimes(1);
		});

		it.skip('Should stop listening once the element has been destroyed', async () => {
			const Agent = new Bridge(({ Disabled }) => Disabled.subscribe(third));
			expect(third).not.toBeCalled();

			const button = document.createElement('button');
			const destroy = Agent.onMount(button, 'button-element');

			expect(third).toBeCalledTimes(1);
			Agent.Disabled.set(true);
			expect(third).toBeCalledTimes(2);

			destroy();
			Agent.Disabled.set(false);
			expect(third).toBeCalledTimes(2);
		});
	});
});

describe.skip('methods', () => {
	describe.skip('onMount', () => {
		it.skip('Should have an onMount method', () => {
			expect(Element).toHaveProperty('onMount');
			expect(Element.onMount).toBeInstanceOf(Function);
		});

		const Element = new Bridge();
		describe.skip('unsubscriber', () => {
			it.skip('Should return a function', () => {
				const section = document.createElement('section');
				const func = Element.onMount(section, 'section-element');
				expect(func).toBeInstanceOf(Function);
				add(func);
			});

			it.skip('Should set Element - element, Name - name (id) and Disabled - isDisabled to undefined', () => {
				const div = document.createElement('div');
				const func = Element.onMount(div, 'div-element');

				func();
				expect(Element.name).toBeUndefined();
				expect(Element.element).toBeUndefined();
				expect(Element.isDisabled).toBeUndefined();

				expect(get(Element.Name)).toBeUndefined();
				expect(get(Element.Element)).toBeUndefined();
				expect(get(Element.Disabled)).toBeUndefined();
			});
		});

		it.skip('Should update the linked element and its name (id)', () => {
			const summary = document.createElement('summary');
			add(Element.onMount(summary, 'summary-element'));
			expect(Element.name).toBe('summary-element');
			expect(Element.element).toBe(summary);
		});
	});
});

describe.skip('getters', () => {
	const Element = new Bridge();
	describe.skip('isDisabled', () => {
		it.skip('Should have an isDisabled getter', () => {
			expect(Element).toHaveProperty('isDisabled');
			expect(Element.isDisabled).not.toBeInstanceOf(Function);
		});

		it.skip('Should return the current disabled state of the element', () => {
			add(Element.onMount(document.createElement('nav'), 'nav-element'));
			expect(Element.isDisabled).toBeUndefined();
			Element.Disabled.set(true);
			expect(Element.isDisabled).toBe(true);
		});
	});

	describe.skip('element', () => {
		it.skip('Should have a element getter', () => {
			expect(Element).toHaveProperty('element');
			expect(Element.element).not.toBeInstanceOf(Function);
		});

		it.skip('Should return the current element', () => {
			const dialog = document.createElement('dialog');
			const destroy = Element.onMount(dialog, 'dialog-element');
			expect(Element.element).toBe(dialog);

			destroy(), expect(Element.element).toBeUndefined();

			const article = document.createElement('article');
			add(Element.onMount(article, 'article-element'));
			expect(Element.element).toBe(article);
		});
	});
});

describe.skip('name', () => {
	it.skip('Should have a name getter', () => {
		expect(Element).toHaveProperty('name');
		expect(Element.name).not.toBeInstanceOf(Function);
	});

	it.skip('Should return the current element id', () => {
		add(Element.onMount(document.createElement('section'), 'section-element'));
		expect(Element.name).toBe('section-element');
		Element.Name.set('feed');
		expect(Element.name).toBe('feed');
	});

	it.skip('Should be a setter as well', () => {
		add(Element.onMount(document.createElement('span'), 'span-element'));
		expect(Element.name).toBe('span-element');
		const name = (Element.name = 'awesome-span');
		expect(Element.name).toBe('awesome-span');
		expect(name).toBe('awesome-span');
	});

	it.skip('Should update the Name store', () => {
		add(Element.onMount(document.createElement('h2'), 'h2-element'));
		Element.name = 'awesome-h2';
		expect(Element.name).toBe('awesome-h2');
		expect(get(Element.Name)).toBe('awesome-h2');
	});
});

describe.skip('stores', () => {
	describe.skip('Active', () => {
		it.skip('Should have an Active store property', () => {
			expect(Element).toHaveProperty('Active');
			expect(isStore(Element.Active)).toBe(true);
		});

		it.skip('Should be writable', () => {
			expect(isWritable(Element.Active)).toBe(true);
		});
	});

	describe.skip('Disabled', () => {
		it.skip('Should have a Disabled store property', () => {
			expect(Element).toHaveProperty('Disabled');
			expect(isStore(Element.Disabled)).toBe(true);
		});

		it.skip('Should be writable', () => {
			expect(isWritable(Element.Disabled)).toBe(true);
		});
	});

	describe.skip('Name', () => {
		it.skip('Should have a Name store property', () => {
			expect(Element).toHaveProperty('Name');
			expect(isStore(Element.Name)).toBe(true);
		});

		it.skip('Should be writable', () => {
			expect(isWritable(Element.Name)).toBe(true);
		});
	});

	describe.skip('Element', () => {
		it.skip('Should have a Element store property', () => {
			expect(Element).toHaveProperty('Element');
			expect(isStore(Element.Element)).toBe(true);
		});

		it.skip('Should be readable', () => {
			expect(isWritable(Element)).toBe(false);
		});
	});

	describe.skip('Selected', () => {
		it.skip('Should have a Selected store property', () => {
			expect(Element).toHaveProperty('Selected');
			expect(isStore(Element.Selected)).toBe(true);
		});

		it.skip('Should be readable', () => {
			expect(isWritable(Element)).toBe(false);
		});
	});
});

describe.skip('With Render and Action Components', () => {
	describe.skip('disabled', () => {
		describe.skip('Action Component', () => {
			describe.skip('[Component -> Element]', () => {
				it.skip('Should forward the component disabled attribute to the element', async () => {
					const { findByText } = render(ActionComponent, { props: { disabled: true } });
					const button = await findByText('Button');
					expect(button).toBeDisabled();
				});

				it.skip('Should be reactive', async () => {
					const { component, findByText } = render(ActionComponent, { props: { disabled: true } });
					const button = await findByText('Button');
					expect(button).toBeDisabled();

					await act(() => component.$set({ disabled: false }));
					waitFor(() => expect(button).not.toBeDisabled());
				});
			});

			describe.skip('[Element -> Component]', () => {
				it.skip('Should take the element disabled attritute and update the Bridge Disabled store', async () => {
					const { findByText, findByTestId } = render(ActionComponent);
					const panel = await findByText('Panel');
					const disabledHolder = await findByTestId('panel-disabled');

					expect(panel).toHaveAttribute('disabled');
					expect(disabledHolder).toHaveTextContent('true');
				});
			});
		});

		describe.skip('Render', () => {
			describe.skip('[Render -> Bridge]', () => {
				it.skip('Should update the Bridge Disabled store with the disabled prop', async () => {
					for (const as of elementTagNames) {
						const Proxy = new Bridge();
						const { component, findByTestId } = render(Render, {
							props: { as, Proxy, disabled: true }
						});
						const element = await findByTestId(`render-${as}`);

						expect(element).toHaveAttribute('disabled');
						expect(get(Proxy.Disabled)).toBe(true);

						component.$destroy();
					}
				});

				it.skip('Should be reactive', async () => {
					for (const as of elementTagNames) {
						const Proxy = new Bridge();
						const { component, findByTestId } = render(Render, {
							props: { as, Proxy, disabled: true }
						});
						const element = await findByTestId(`render-${as}`);

						expect(element).toHaveAttribute('disabled');
						expect(get(Proxy.Disabled)).toBe(true);

						await act(() => component.$set({ disabled: false }));
						expect(element).not.toHaveAttribute('disabled');
						expect(get(Proxy.Disabled)).toBe(undefined);

						component.$destroy();
					}
				});
			});

			describe.skip('[Bridge -> Render]', () => {
				it.skip('Should update the Render disabled prop with the Bridge Disabled store value', async () => {
					for (const as of elementTagNames) {
						const Proxy = new Bridge();
						const { Disabled } = Proxy;
						Disabled.set(true);

						const { component, findByTestId } = render(Render, { props: { as, Proxy } });
						const element = await findByTestId(`render-${as}`);

						expect(element).toHaveAttribute('disabled');
						expect(get(Disabled)).toBe(true);

						component.$destroy();
					}
				});

				it.skip('Should be reactive', async () => {
					for (const as of elementTagNames) {
						const Proxy = new Bridge();
						Proxy.Disabled.set(true);

						const { component, findByTestId } = render(Render, { props: { as, Proxy } });
						const element = await findByTestId(`render-${as}`);

						expect(element).toHaveAttribute('disabled');
						expect(get(Proxy.Disabled)).toBe(true);

						await act(() => Proxy.Disabled.set(false));
						expect(element).not.toHaveAttribute('disabled');

						component.$destroy();
					}
				});
			});
		});
	});
});

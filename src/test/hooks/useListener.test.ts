import { useListener } from '$lib/hooks';
import { useCleaner } from '@test-utils';
import { fireEvent } from '@testing-library/dom';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

it('Should return a function', () => {
	const div = document.createElement('div');
	const destroy = useListener(div, 'click', () => {});
	expect(destroy).toBeInstanceOf(Function);
	add(destroy());
});

it('Should add the given event listener', () => {
	const input = document.createElement('input');
	const func = vi.fn<[FocusEvent]>(() => {});
	add(useListener(input, 'focus', func));
	fireEvent.focus(input);
	expect(func).toBeCalledTimes(1);
	expect(func.mock.calls[0][0]).toBeInstanceOf(FocusEvent);
});

it('Should remove the event listener after calling the returned function', () => {
	const func = vi.fn(() => {});
	const button = document.createElement('button');
	const destroy = useListener(button, 'click', func);
	fireEvent.click(button);
	expect(func).toBeCalledTimes(1);
	destroy();
	fireEvent.click(button);
	expect(func).toBeCalledTimes(1);
});

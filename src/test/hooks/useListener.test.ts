import { fireEvent } from '@testing-library/dom';
import { useListener } from '$lib/hooks';
import { useCleaner } from '@test-utils';

const { add, destroy } = useCleaner();

afterEach(() => destroy());

it('Should add the given event listener', () => {
	const input = document.createElement('input');
	const fn = vi.fn<[FocusEvent]>(() => {});
	add(useListener(input, 'focus', fn));
	fireEvent.focus(input);
	expect(fn).toBeCalledTimes(1);
});

it('Should return a fn', () => {
	const input = document.createElement('input');
	const fn = vi.fn<[FocusEvent]>(() => {});
	const free = useListener(input, 'focus', fn);
	expect(free).toBeTypeOf('function');
	add(free);
});

it('Should remove the event listener after calling the returned fn', () => {
	const input = document.createElement('input');
	const fn = vi.fn<[FocusEvent]>(() => {});
	const free = useListener(input, 'focus', fn);
	fireEvent.focus(input);
	expect(fn).toBeCalledTimes(1);
	free();
	fireEvent.focus(input);
	expect(fn).toBeCalledTimes(1);
});

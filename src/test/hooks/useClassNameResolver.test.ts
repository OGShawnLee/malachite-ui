import type { ClassNameObject, ComponentState } from '$lib/types';
import { useClassNameResolver } from '$lib/hooks';

const fullClassName: ClassNameObject = {
	active: { on: 'active', off: 'inactive' },
	base: 'button',
	checked: { on: 'checked', off: 'unchecked' },
	disabled: 'disabled',
	selected: { on: 'selected', off: 'unselected' },
	open: { on: 'open', off: 'closed' },
	dual: 'dual',
	triple: 'triple'
};

const resolve = useClassNameResolver(fullClassName);

const state: ComponentState = {
	isActive: false,
	isChecked: false,
	isDisabled: false,
	isOpen: false,
	isSelected: false
};

it('Should return a function', () => {
	expect(useClassNameResolver('button')).toBeInstanceOf(Function);
});

it('Should return the className if it is a string', () => {
	expect(useClassNameResolver<'isOpen'>('button')({ isOpen: true })).toBe('button');
});

describe('White Space', () => {
	it('Should return null if all the given classNames are whitespace', () => {
		const resolve = useClassNameResolver({
			active: '  ',
			base: '',
			disabled: '              ',
			dual: '		',
			open: '',
			selected: '          '
		});

		let className = resolve({
			isActive: true,
			isChecked: true,
			isDisabled: false,
			isOpen: true,
			isSelected: true
		});
		expect(className).toBeNull();

		className = resolve({
			isActive: false,
			isChecked: false,
			isDisabled: true,
			isOpen: true,
			isSelected: false
		});
		expect(className).toBeNull();
	});

	it('Should remove white space', () => {
		const resolve = useClassNameResolver({
			base: '   ',
			open: '    open',
			active: '    active',
			selected: {
				off: '  unselected '
			}
		});

		let className = resolve({ ...state, isOpen: true, isSelected: true });
		expect(className).toBe('open');

		className = resolve({ ...state, isActive: true });
		expect(className).toBe('active unselected');

		className = resolve({ ...state, isActive: true, isOpen: true });
		expect(className).toBe('open active unselected');
	});

	it('Should remove white space between classNames', () => {
		const resolve = useClassNameResolver({
			base: '   ',
			open: ' open    px-3',
			active: '    active 		bg-cyan-200',
			selected: {
				off: `  unselected 
						color-cyan-400  font-monospace
					`
			}
		});

		let className = resolve({ ...state, isOpen: true });
		expect(className).toBe('open px-3 unselected color-cyan-400 font-monospace');

		className = resolve({ ...state, isActive: true });
		expect(className).toBe('active bg-cyan-200 unselected color-cyan-400 font-monospace');
	});

	it('Should work if given a string', () => {
		const resolve = useClassNameResolver<'isOpen'>(`   button    px-6   
					py-2`);
		expect(resolve({ isOpen: true })).toBe('button px-6 py-2');
	});

	it('Should work if given a function', () => {
		const resolve = useClassNameResolver<'isOpen'>(
			() => `  button    bg-cyan-500     
						text-lg`
		);

		expect(resolve({ isOpen: true })).toBe('button bg-cyan-500 text-lg');
	});
});

it('Should work recursively with base className propery', () => {
	const resolve = useClassNameResolver<'isActive' | 'isOpen'>({
		base: { base: 'button', active: 'button--active' },
		open: 'button--open'
	}); // i dont know if it is useful but looks cool
	let className = resolve({ isActive: false, isOpen: false });
	expect(className).toBe('button');

	className = resolve({ isActive: true, isOpen: true });
	expect(className).toBe('button button--active button--open');
});

it('Should handle nullish values', () => {
	const resolve = useClassNameResolver({
		base: null,
		open: undefined,
		disabled: null,
		active: null,
		dual: null,
		selected: { on: '  button--selected   ', off: null }
	});

	let className = resolve({
		isActive: true,
		isChecked: true,
		isDisabled: true,
		isOpen: true,
		isSelected: true
	});
	expect(className).toBeNull();

	className = resolve({
		isActive: true,
		isChecked: true,
		isDisabled: false,
		isOpen: true,
		isSelected: true
	});
	expect(className).toBeNull();

	className = resolve({
		isActive: false,
		isChecked: true,
		isDisabled: false,
		isOpen: true,
		isSelected: true
	});
	expect(className).toBe('button--selected');
});

it('Should return the result of the base className if it is a function', () => {
	const resolve = useClassNameResolver({
		base: ({ isActive }) => (isActive ? 'button--active' : 'button--inactive'),
		disabled: 'button--disabled',
		open: 'button--open',
		selected: {
			on: 'button--selected',
			off: 'button--unselected'
		},
		dual: 'button--accent'
	});

	expect(resolve({ ...state, isActive: true })).toBe('button--active');
	expect(resolve({ ...state, isActive: false })).toBe('button--inactive');
});

describe('Duplicate ClassNames', () => {
	it('Should remove duplicate classNames', () => {
		const resolve = useClassNameResolver<'isOpen'>('button px-6 px-6 py-2 text-4xl text-4xl');
		expect(resolve({ isOpen: true })).toBe('button px-6 py-2 text-4xl');
	});

	it('Should work with a function className', () => {
		const resolve = useClassNameResolver<'isActive'>(({ isActive }) => {
			return isActive ? 'button button active active' : 'button button inactive inactive';
		});

		expect(resolve({ isActive: true })).toBe('button active');
		expect(resolve({ isActive: false })).toBe('button inactive');
	});

	it('Should work with an object', () => {
		const resolve = useClassNameResolver({
			active: { on: 'active', off: 'inactive px-2' },
			base: { active: 'active              px-2' },
			checked: { on: 'checked px-8   px-8', off: 'unchecked px-2' },
			disabled: 'disabled disabled   disabled',
			selected: { on: 'selected selected    selected', off: '   unselected' },
			open: { on: 'open px-8', off: '   closed' },
			dual: 'dual dual     dual',
			triple: 'triple   triple triple'
		});

		expect(resolve({ ...state, isActive: true })).toBe('active px-2 closed unchecked unselected');
		expect(resolve({ ...state, isActive: false })).toBe(
			'closed inactive px-2 unchecked unselected'
		);
		expect(resolve({ ...state, isOpen: true })).toBe(
			'open px-8 inactive px-2 unchecked unselected'
		);
		expect(resolve({ ...state, isActive: true, isSelected: true })).toBe(
			'closed dual unchecked px-2'
		);
		expect(resolve({ ...state, isActive: true, isChecked: true, isSelected: true })).toBe(
			'closed triple'
		);
		expect(resolve({ ...state, isActive: true, isDisabled: true, isSelected: true })).toBe(
			'disabled'
		);
	});
});

describe('isActive', () => {
	describe('Type -> SwitchClassName', () => {
		it('Should add the active (on) className', () => {
			const className = resolve({ ...state, isActive: true });
			expect(className).toBe('button closed active unchecked unselected');
		});

		it('Should add the inactive (off) className', () => {
			const className = resolve(state);
			expect(className).toBe('button closed inactive unchecked unselected');
		});
	});

	describe('Type -> string', () => {
		it('Should be added if state is active', () => {
			const resolve = useClassNameResolver({ ...fullClassName, active: 'active' });
			expect(resolve({ ...state, isActive: true })).toBe(
				'button closed active unchecked unselected'
			);
		});

		it('Should not be added if state is unactive', () => {
			const resolve = useClassNameResolver({ ...fullClassName, active: 'active' });
			expect(resolve(state)).toBe('button closed unchecked unselected');
		});
	});
});

describe('isChecked', () => {
	describe('Type -> SwitchClassName', () => {
		it('Should add the checked (on) className', () => {
			const className = resolve({ ...state, isChecked: true });
			expect(className).toBe('button closed inactive checked unselected');
		});

		it('Should add the unchecked (off) className', () => {
			const className = resolve(state);
			expect(className).toBe('button closed inactive unchecked unselected');
		});
	});

	describe('Type -> string', () => {
		it('Should be added if state is checked', () => {
			const resolve = useClassNameResolver({ ...fullClassName, checked: 'checked' });
			expect(resolve({ ...state, isChecked: true })).toBe(
				'button closed inactive checked unselected'
			);
		});

		it('Should not be added if state is unselected', () => {
			const resolve = useClassNameResolver({ ...fullClassName, checked: 'checked' });
			expect(resolve(state)).toBe('button closed inactive unselected');
		});
	});
});

describe('isDisabled', () => {
	it('Should ignore all other classNames', () => {
		expect(resolve({ ...state, isDisabled: true })).toBe('button disabled');
	});

	it('Should not be added if state is not disabled', () => {
		expect(resolve(state)).toBe('button closed inactive unchecked unselected');
	});

	describe('Type -> SwithClassName', () => {
		const resolve = useClassNameResolver<'isDisabled' | 'isOpen'>({
			base: 'button',
			disabled: { on: 'disabled', off: 'enabled' },
			open: { on: 'open', off: 'closed' }
		});

		it('Should add the disabled (on) className', () => {
			expect(resolve({ isDisabled: true, isOpen: false })).toBe('button disabled');
		});

		it('Should add the disabled (off) className', () => {
			expect(resolve({ isDisabled: false, isOpen: false })).toBe('button enabled closed');
		});
	});
});

describe('isOpen', () => {
	describe('Type -> SwitchClassName', () => {
		it('Should add the open (on) className', () => {
			const className = resolve({ ...state, isOpen: true });
			expect(className).toBe('button open inactive unchecked unselected');
		});

		it('Should add the closed (off) className', () => {
			const className = resolve(state);
			expect(className).toBe('button closed inactive unchecked unselected');
		});
	});
});

describe('isSelected', () => {
	describe('Type -> SwitchClassName', () => {
		it('Should add the selected (on) className', () => {
			const className = resolve({ ...state, isSelected: true });
			expect(className).toBe('button closed inactive unchecked selected');
		});

		it('Should add the inactive (off) className', () => {
			const className = resolve(state);
			expect(className).toBe('button closed inactive unchecked unselected');
		});
	});

	describe('Type -> string', () => {
		it('Should be added if state is selected', () => {
			const resolve = useClassNameResolver({ ...fullClassName, selected: 'selected' });
			expect(resolve({ ...state, isSelected: true })).toBe(
				'button closed inactive unchecked selected'
			);
		});

		it('Should not be added if state is unselected', () => {
			const resolve = useClassNameResolver({ ...fullClassName, selected: 'selected' });
			expect(resolve(state)).toBe('button closed inactive unchecked');
		});
	});
});

describe('Dual ClassName', () => {
	describe('Dual Combination', () => {
		it('ACTIVE-CHECKED -> Should add the dual className when state is Active and Checked', () => {
			const className = resolve({ ...state, isActive: true, isChecked: true }, 'ACTIVE-CHECKED');
			expect(className).toBe('button closed dual unselected');
		});

		it('ACTIVE-SELECTED -> Should add the dual className when state is Active and Selected', () => {
			const className = resolve({ ...state, isActive: true, isSelected: true }, 'ACTIVE-SELECTED');
			expect(className).toBe('button closed dual unchecked');
		});

		it('CHECKED-SELECTED -> Should add the dual className when state is Checked and Selected', () => {
			const className = resolve(
				{ ...state, isChecked: true, isSelected: true },
				'CHECKED-SELECTED'
			);
			expect(className).toBe('button closed dual inactive');
		});

		it('Should add the dual className when state is both Active and Selected by default', () => {
			const className = resolve({ ...state, isActive: true, isSelected: true });
			expect(className).toBe('button closed dual unchecked');
		});
	});
});

describe('Triple ClassName', () => {
	it('Should add the triple className if state is Active, Checked and Selected', () => {
		const className = resolve({ ...state, isActive: true, isChecked: true, isSelected: true });
		expect(className).toBe('button closed triple');
	});
});

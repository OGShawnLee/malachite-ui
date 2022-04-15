import '@testing-library/jest-dom';
import type { SpyInstance } from 'vitest';
import { isArray, isObject } from '$lib/predicate';
import * as utils from '@test-utils';

describe('appendChild', () => {
	it('Should append the given element to the body by default', () => {
		const button = document.createElement("button");
		expect(document.body).not.toContainElement(button);

		utils.appendChild(button);
		expect(document.body).toContainElement(button);
	});
    
    it("Should append it to the given container", () => {
        const span = document.createElement('span');

        const container = document.createElement("div")
        utils.appendChild(span, container)

        expect(container).toContainElement(span)
    })

    it("Should return the appended element", () => {
        const foo = document.createElement("article")
        const bar = utils.appendChild(foo)
        expect(foo).toBe(bar)
    })
});

describe('generateActions', () => {
	const { generateActions } = utils;
	it('Should return an array of a tuple: [mock: SpyInstanceFn<[HTMLElement, number], void> , argument: number]', () => {
		const actions = generateActions(5);
		expect(actions).toBeInstanceOf(Array);
		for (const [action, argument] of actions) {
			expect(vi.isMockFunction(action)).toBe(true);
			expect(typeof argument === 'number').toBe(true);
		}
	});

	it('Should return the given amount of actions', () => {
		expect(generateActions(10)).toHaveLength(10);
	});

	it('Each function should be unique', () => {
		const set = new Set<SpyInstance>();
		const actions = generateActions(5);
		for (const [action] of actions) {
			set.add(action);
		}

		expect(set.size).toBe(actions.length);
	});

	it('Each argument should be the index of the current action', () => {
		const actions = generateActions(5);
		actions.forEach((action, index) => {
			expect(action[1]).toBe(index);
		});
	});
});

describe('generateSpyFunctions', () => {
	const { generateSpyFunctions } = utils;
	it('Should return an array of spy functions', () => {
		const functions = generateSpyFunctions(5);
		expect(functions).toBeInstanceOf(Array);
		for (const func of functions) {
			expect(vi.isMockFunction(func)).toBe(true);
		}
	});

	it('Should return the given amount of spy functions', () => {
		expect(generateSpyFunctions(10)).toHaveLength(10);
	});

	it('Each function should be unique', () => {
		const set = new Set<SpyInstance>();
		const functions = generateSpyFunctions(5);
		for (const func of functions) {
			set.add(func);
		}

		expect(set.size).toBe(functions.length);
	});
});

describe('generateSpyFunctions', () => {
	const { generateSpyFunctions } = utils;
	const functions = generateSpyFunctions(5);

	it('Should return an array of the given length', () => {
		expect(functions).toHaveLength(5);
	});

	it('Should return an array of spy functions', () => {
		expect(isArray(functions, vi.isMockFunction)).toBe(true);
	});

    it('Each function should be unique', () => {
        const functions = generateSpyFunctions(5)
        const unique = new Set(functions);
        expect(unique.size).toBe(functions.length)
	});
});

describe('isValidComponentName', () => {
	it('Should return true if the given element id contains the component name', () => {
		const element = utils.appendChild(document.createElement('div'));
		element.id = 'disclosure';
		expect(utils.isValidComponentName(element, 'disclosure')).toBe(true);
	});

	it('Should return false if the given element id is duplicate', () => {
		const div = utils.appendChild(document.createElement('div'));
		div.id = 'disclosure';

		const button = utils.appendChild(document.createElement('button'));
		button.id = 'disclosure';

		expect(utils.isValidComponentName(div, 'disclosure')).toBe(false);
	});

	describe('child', () => {
		it('Should return true if the id contains the component and the component child name', () => {
			const element = utils.appendChild(document.createElement('div'));
			element.id = 'disclosure-button';
			expect(utils.isValidComponentName(element, 'disclosure', 'button')).toBe(true);
		});

		it('Should return false if the id does not contain the component and the component child name', () => {
			const element = utils.appendChild(document.createElement('div'));
			element.id = 'disclosure-panel';
			expect(utils.isValidComponentName(element, 'disclosure', 'button')).toBe(false);
		});
	});
});

describe('useCleaner', () => {
	const { generateSpyFunctions, useCleaner } = utils;
	it('Should return an object: { add, destroy }', () => {
		expect(isObject(useCleaner(), ['add', 'destroy'])).toBe(true);
	});

	describe('add', () => {
        it("Should be a function", () => {
            expect(useCleaner().add).toBeInstanceOf(Function)
        })
        
		it('Should add the given values to the list of Collectable values', () => {
            const { add, destroy } = useCleaner();
			const additional = generateSpyFunctions(10);
			add(additional), destroy();
			for (const func of additional) {
                expect(func).toBeCalledTimes(1);
			}
		});
	});
    
	describe('destroy', () => {
        const functions = generateSpyFunctions(5);
        const { add, destroy } = useCleaner(functions);

        it("Should be a function", () => {
            expect(useCleaner().destroy).toBeInstanceOf(Function)
        })

		it('Should destroy the current Collectable values', () => {
			destroy();
			for (const func of functions) {
				expect(func).toBeCalledTimes(1);
			}
		});

		it('Should not call previous Collectable values', () => {
			const additional = generateSpyFunctions(5);
			add(additional), destroy();
			for (const func of functions) expect(func).toBeCalledTimes(1);
			for (const func of additional) expect(func).toBeCalledTimes(1);
		});
	});
});
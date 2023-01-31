import { useComponentNaming } from '$lib/hooks';
import { isFunction, isInterface, isNumber, isString } from '$lib/predicate';

describe.skip('useComponentNaming', () => {
	const initialResult = useComponentNaming({ name: 'menu', index: 0 });

	it.skip('Should return an object: ({ baseName: string, index: number, nameChild: Function })', () => {
		expect(
			isInterface<ReturnType<typeof useComponentNaming>>(initialResult, {
				baseName: isString,
				index: isNumber,
				nameChild: isFunction
			})
		).toBe(true);
	});

	describe.skip('baseName', () => {
		it.skip('Should be a string formated as {parent}-{name}-{index}', () => {
			expect(useComponentNaming({ name: 'menu', index: 0 }).baseName).toBe('malachite-menu-0');
		});

		it.skip('Should appear in the string returned by nameChild', () => {
			expect(initialResult.nameChild('header')).toBe(initialResult.baseName + '-header');
		});
	});

	describe.skip('nameChild', () => {
		it.skip('Should always return a string', () => {
			expect(isString(initialResult.nameChild('panel'))).toBe(true);
			expect(isString(initialResult.nameChild('panel', 0))).toBe(true);
		});

		it.skip('Should return a string formated as "{baseName}-{childName}" by default', () => {
			expect(initialResult.nameChild('panel')).toBe('malachite-menu-0-panel');
		});

		describe.skip('Parameters', () => {
			describe.skip('childName', () => {
				it.skip('Should determine the {childName} value', () => {
					expect(initialResult.nameChild('button')).toBe('malachite-menu-0-button');
					expect(initialResult.nameChild('panel')).toBe('malachite-menu-0-panel');
					expect(initialResult.nameChild('item', 0)).toBe('malachite-menu-0-item-0');
				});

				it.skip('Should throw if it is an empty string', () => {
					expect(() => initialResult.nameChild('    ', 0)).toThrow(
						'childName must not be an empty string.'
					);
				});
			});

			describe.skip('index', () => {
				it.skip('Should be optional', () => {
					expect(initialResult.nameChild('button')).toBe('malachite-menu-0-button');
					expect(initialResult.nameChild('panel')).toBe('malachite-menu-0-panel');
					expect(initialResult.nameChild('item')).toBe('malachite-menu-0-item');
				});

				it.skip('Should turn the string format into "{baseName}-{component}-{index}"', () => {
					expect(initialResult.nameChild('button', 5)).toBe('malachite-menu-0-button-5');
					expect(initialResult.nameChild('panel', 10)).toBe('malachite-menu-0-panel-10');
					expect(initialResult.nameChild('item', 15)).toBe('malachite-menu-0-item-15');
				});
			});
		});
	});

	describe.skip('Parameters', () => {
		describe.skip('Configuration', () => {
			describe.skip('parent', () => {
				const { baseName, nameChild } = useComponentNaming({
					parent: 'sapphire-ui',
					name: 'disclosure',
					index: 0
				});

				it.skip('Should determine the prefix of the baseName', () => {
					expect(baseName).toBe('sapphire-ui-disclosure-0');
					expect(nameChild('button')).toBe('sapphire-ui-disclosure-0-button');
				});

				it.skip('Should default to the name of the library (malachite)', () => {
					expect(initialResult.baseName).toBe('malachite-menu-0');
				});

				describe.skip('Whitespace', () => {
					it.skip('Should throw an error if it is an empty string', () => {
						expect(() => useComponentNaming({ name: '    ', index: 0 })).toThrow(
							'name must not be an empty string.'
						);
					});

					it.skip('Should handle whitespace', () => {
						const { baseName } = useComponentNaming({ name: `    accordion`, index: 0 });
						expect(baseName).toBe('malachite-accordion-0');
					});

					it.skip('Should separate the name with dashes if it contains multiple words', () => {
						const { baseName } = useComponentNaming({ name: `    accordion   element`, index: 0 });
						expect(baseName).toBe('malachite-accordion-element-0');
					});
				});

				it.skip('Should not include any prefix if the given value is null', () => {
					const { baseName, nameChild } = useComponentNaming({
						parent: null,
						name: 'menu',
						index: 0
					});
					expect(baseName).toBe('menu-0');
					expect(nameChild('button')).toBe('menu-0-button');
				});
			});

			describe.skip('name', () => {
				it.skip('Should be included in baseName', () => {
					expect(initialResult.baseName).toContain('menu');
				});

				it.skip('Should throw if it is an empty string', () => {
					expect(() => useComponentNaming({ name: `     		`, index: 0 })).toThrow(
						'name must not be an empty string.'
					);
				});
			});

			describe.skip('index', () => {
				it.skip('Should determine the number used at the end of the baseName', () => {
					expect(initialResult.baseName).toBe('malachite-menu-0');
					expect(initialResult.nameChild('button')).toBe('malachite-menu-0-button');
				});

				it.skip('Should always add 0 to the given index', () => {
					expect(initialResult.index).toBe(0);
				});

				it.skip('Should be returned', () => {
					expect(initialResult.index).toBe(0);
				});
			});
		});
	});
});

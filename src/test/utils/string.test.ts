import { clearString } from '$lib/utils';

describe.skip('clearString', () => {
	it.skip('Should trim the given string', () => {
		expect(clearString('    this is a string    ')).toBe('this is a string');
	});

	it.skip('Should clear unnecesary spaces between words', () => {
		expect(clearString('    this     is a    string    ')).toBe('this is a string');
	});

	it.skip('Should clear all white space', () => {
		expect(
			clearString(`    
        this    is
                  a string
        
        
        `)
		).toBe('this is a string');
	});
});

import { clearString } from '$lib/utils';

describe('clearString', () => {
	it('Should trim the given string', () => {
		expect(clearString('    this is a string    ')).toBe('this is a string');
	});

	it('Should clear unnecesary spaces between words', () => {
		expect(clearString('    this     is a    string    ')).toBe('this is a string');
	});

	it('Should clear all white space', () => {
		expect(
			clearString(`    
        this    is
                  a string
        
        
        `)
		).toBe('this is a string');
	});
});

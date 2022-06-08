import { Bridge } from '$lib/stores';
import { isActionComponent } from '$lib/predicate';

describe('isActionComponent', () => {
	it('Should return true if value has correct ActionComponent shape and prop types', () => {
		expect(isActionComponent({ Proxy: new Bridge(), action: () => 360 })).toBe(true);
	});

	it('Should return false if value is missing keys', () => {
		expect(isActionComponent({ name: 'James', displayName: 'James Bond' })).toBe(false);
		expect(isActionComponent({ Proxy: 'James', displayName: 'James Bond' })).toBe(false);
	});

	it('Should return false if value has correct keys but wrong types', () => {
		expect(isActionComponent({ Proxy: 'James', action: 'James Bond' })).toBe(false);
		expect(isActionComponent({ Proxy: 39, action: 'James Bond' })).toBe(false);
		expect(isActionComponent({ Proxy: {}, action: () => 360 })).toBe(false);
	});

	it('Should return false if value has correct keys but not all keys have correct type', () => {
		expect(isActionComponent({ Proxy: new Bridge(), action: 'James Bond' })).toBe(false);
		expect(isActionComponent({ Proxy: 39, action: () => 360 })).toBe(false);
	});

	it('Should handle non object and falsy values by returning false', () => {
		expect(isActionComponent('Imposter')).toBe(false);
		expect(isActionComponent(619)).toBe(false);
		expect(isActionComponent(false)).toBe(false);
		expect(isActionComponent(true)).toBe(false);
		expect(isActionComponent(null)).toBe(false);
		expect(isActionComponent(undefined)).toBe(false);
	});
});

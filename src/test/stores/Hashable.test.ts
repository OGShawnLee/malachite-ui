import { Hashable } from '$lib/stores';
import { isNumber, isObject, isStore } from '$lib/predicate';
import { get } from 'svelte/store';

describe('hashable', () => {
	const Hash = new Hashable<string, string>();
	afterEach(() => Hash.clear());

	it('Should return an object', () => {
		expect(isObject(Hash)).toBe(true);
	});

	it('Should be a valid store', () => {
		const hash = get(Hash);
		expect(isStore(Hash)).toBe(true);

		const callback = vi.fn((hash: Map<string, string>) => hash);
		const destroy = Hash.subscribe(callback);
		expect(callback).toBeCalledTimes(1);
		expect(callback).toBeCalledWith(hash);

		Hash.add('Monad', 'Mosk');
		expect(callback).toBeCalledTimes(2);
		expect(callback.mock.calls[1][0].has('Monad'));

		Hash.add('Vincent', 'Mosk');
		expect(callback).toBeCalledTimes(3);
		expect(callback.mock.calls[2][0].has('Vincent'));

		Hash.clear();
		expect(callback).toBeCalledTimes(4);
		expect(callback.mock.calls[3][0].size).toBe(0);

		destroy();
	});

	it('Should be empty by default', () => {
		expect(get(Hash).size).toBe(0);
	});

	describe('methods', () => {
		describe('add', () => {
			it('Should have an add method', () => {
				expect(Hash).toHaveProperty('add');
				expect(Hash.add).toBeInstanceOf(Function);
			});

			it('Should add items', () => {
				Hash.add('Senex', 'Charos');
				expect(Hash.has('Senex')).toBe(true);
				expect(Hash.get('Senex')).toBe('Charos');

				Hash.add('Kaskis', 'Asura');
				expect(Hash.has('Kaskis')).toBe(true);
				expect(Hash.get('Kaskis')).toBe('Asura');
			});

			describe('return', () => {
				it('Should return an object', () => {
					expect(isObject(Hash.add('China', 'Chinese'))).toBe(true);
				});

				it('Should have an index property which is the index of the item', () => {
					const mexico = Hash.add('Mexico', 'Spanish');
					expect(mexico).toHaveProperty('index');
					expect(mexico.index).toBe(0);

					const korea = Hash.add('South Korea', 'Korean');
					expect(korea.index).toBe(1);
					Hash.delete('South Korea');

					const spain = Hash.add('Spain', 'Spanish');
					expect(spain.index).toBe(1);
				});

				it('Should have a value property which is the added value', () => {
					const mexico = Hash.add('Mexico', 'Spanish');
					expect(mexico).toHaveProperty('value');
					expect(mexico.value).toBe('Spanish');

					const korea = Hash.add('South Korea', 'Korean');
					expect(korea.value).toBe('Korean');
				});

				it('Should have a destroy property which is a function that deletes the item', () => {
					const mexico = Hash.add('Mexico', 'Spanish');
					expect(mexico).toHaveProperty('destroy');
					expect(mexico.value).toBe('Spanish');
					expect(Hash.has('Mexico'));
					expect(mexico.destroy).toBeInstanceOf(Function);
					mexico.destroy();
					expect(Hash.has('Mexico')).toBe(false);

					const korea = Hash.add('South Korea', 'Korean');
					expect(Hash.has('South Korea')).toBe(true);
					korea.destroy();
					expect(Hash.has('South Korea')).toBe(false);
				});
			});

			it('Should throw if the item is duplicate', () => {
				Hash.add('One', 'Romdo');
				const check = () => Hash.add('One', 'Romdo');
				expect(check).toThrowError('Unable to Add Item: Duplicate');
			});
		});

		describe('clear', () => {
			it('Should have a clear method', () => {
				expect(Hash).toHaveProperty('clear');
				expect(Hash.clear).toBeInstanceOf(Function);
			});

			it('Should clear the hash', () => {
				const tuples = [
					['First', 'One'],
					['Second', 'Two'],
					['Third', 'Three']
				];
				for (const [key, value] of tuples) Hash.add(key, value);

				expect(Hash.size).toBe(3);
				for (const [key] of tuples) expect(Hash.has(key)).toBe(true);
				Hash.clear();
				expect(Hash.size).toBe(0);
				for (const [key] of tuples) expect(Hash.has(key)).toBe(false);
			});
		});

		describe('delete', () => {
			it('Should have a delete method', () => {
				expect(Hash).toHaveProperty('delete');
				expect(Hash.delete).toBeInstanceOf(Function);
			});

			it('Should delete an item', () => {
				Hash.add('Earth', 'Tierra');
				expect(Hash.has('Earth')).toBe(true);
				Hash.delete('Earth');
				expect(Hash.has('Earth')).toBe(false);
			});

			it('Should return true if the item was deleted', () => {
				Hash.add('Earth', 'Tierra');
				expect(Hash.delete('Earth')).toBe(true);
			});

			it('Should return false if the item was deleted', () => {
				expect(Hash.delete('404')).toBe(false);
			});

			it('Should trigger a subscription callback only if the item was deleted', () => {
				const fn = vi.fn(() => {});
				const destroy = Hash.subscribe(fn);
				Hash.delete('404');
				expect(fn).toBeCalledTimes(1);

				Hash.add('Neptune', 'Neptuno');
				expect(fn).toBeCalledTimes(2);
				Hash.delete('Neptune');
				expect(fn).toBeCalledTimes(3);

				destroy();
			});
		});

		describe('destroy', () => {
			it('Should have a destroy method', () => {
				expect(Hash).toHaveProperty('destroy');
				expect(Hash.destroy).toBeInstanceOf(Function);
			});

			it('Should return a function', () => {
				const { value } = Hash.add('First', 'One');
				expect(Hash.destroy(value)).toBeInstanceOf(Function);
			});
		});

		describe('get', () => {
			it('Should have a get method', () => {
				expect(Hash).toHaveProperty('get');
				expect(Hash.get).toBeInstanceOf(Function);
			});

			it('Should return the requested value if it exists', () => {
				Hash.add('Galaxy', 'Galaxia');
				expect(Hash.get('Galaxy')).toBe('Galaxia');
			});

			it('Should return undefined if the value does not exist', () => {
				expect(Hash.get('404')).toBeUndefined();
			});
		});

		describe('has', () => {
			it('Should have a has method', () => {
				expect(Hash).toHaveProperty('has');
				expect(Hash.has).toBeInstanceOf(Function);
			});
		});

		describe('push', () => {
			it('Should have a push method', () => {
				expect(Hash).toHaveProperty('push');
				expect(Hash.push).toBeInstanceOf(Function);
			});
		});

		describe('set', () => {
			const Hash = new Hashable<number, { name: string }>();

			afterEach(() => Hash.clear());

			it('Should have a set method', () => {
				expect(Hash).toHaveProperty('set');
				expect(Hash.set).toBeInstanceOf(Function);
			});

			it('Should add a new value if no value with the given key existed', () => {
				expect(Hash.has(0)).toBe(false);
				Hash.set(0, { name: 'James' });
				expect(Hash.has(0)).toBe(true);
			});

			it('Should overwrite the previous value', () => {
				const first = { name: 'Raul' };
				expect(Hash.has(0)).toBe(false);
				Hash.add(0, first);
				const second = { name: 'Raul' };
				Hash.set(0, second);

				const value = Hash.get(0);
				expect(value).toBeDefined();
				expect(first).not.toBe(value);
			});
		});

		describe('update', () => {
			it('Should have a update method', () => {
				expect(Hash).toHaveProperty('update');
				expect(Hash.update).toBeInstanceOf(Function);
			});
		});
	});

	describe('properties', () => {
		describe('size', () => {
			it('Should have a size property', () => {
				it('Should have a push method', () => {
					expect(Hash).toHaveProperty('size');
				});

				it('Should be a number', () => {
					expect(isNumber(Hash.size)).toBe(true);
				});
			});
		});
	});
});

describe('hashable', () => {
	const Planets = new Hashable<string, string>();
	const planets = [
		['mercury', 'mercurio'],
		['venus', 'venus'],
		['earth', 'tierra'],
		['mars', 'marte'],
		['jupiter', 'jupiter'],
		['saturn', 'saturno'],
		['uranus', 'urano'],
		['neptune', 'neptuno']
	];

	afterEach(() => Planets.clear());

	it('Should return an object', () => {
		expect(isObject(Planets)).toBe(true);
	});

	it('Should return a valid store', () => {
		expect(isStore(Planets)).toBe(true);
	});

	it('Should be empty by default', () => {
		expect(get(Planets).size).toBe(0);
	});

	it('Should be able to subscribe to changes', () => {
		const value = get(Planets);
		const callback = vi.fn((map: Map<string, string>) => map);
		const collect = Planets.subscribe(callback);

		expect(callback).toBeCalledTimes(1);
		expect(callback.mock.calls[0][0]).toBe(value);

		for (const [index, [planet, spanish]] of planets.entries()) {
			expect(callback).toBeCalledTimes(index + 1);
			Planets.add(planet, spanish);
			expect(callback.mock.calls[0][0]).toBe(value);
		}

		collect();
	});

	describe('add', () => {
		const Hash = new Hashable<string, string>();
		const data = [
			['One', 'Romdo'],
			['Monad', 'Mosk'],
			['Senex', 'Charos']
		];

		it('Should have an add method', () => {
			expect(Hash).toHaveProperty('add');
			expect(Hash.add).toBeInstanceOf(Function);
		});

		it('Should add items', () => {
			expect(isObject(Hash, ['add'])).toBe(true);

			const [one, romdo] = data[0];
			Hash.add(one, romdo);
			expect(get(Hash).has(one)).toBe(true);

			const [monad, mosk] = data[1];
			Hash.add(monad, mosk);
			expect(get(Hash).has(monad)).toBe(true);
		});

		it('Should return an object of the index, value and a destroy function', () => {
			const [senex, charos] = data[2];
			const result = Hash.add(senex, charos);

			expect(isObject(result)).toBe(true);
			expect(isObject(result, ['index', 'value', 'destroy'])).toBe(true);
			expect(result).toContain({ index: 2, value: charos });
			expect(result.destroy).toBeInstanceOf(Function);
		});

		it('Should throw if the item is already present', () => {
			const [monad, mosk] = data[1];
			const check = () => Hash.add(monad, mosk);
			expect(check).toThrowError('Unable to Add Item: Duplicate');
		});
	});

	describe('delete', () => {
		it('Should have a delete method', () => {
			expect(Planets).toHaveProperty('delete');
			expect(Planets.delete).toBeInstanceOf(Function);
		});

		it('Should delete items', () => {
			const [mercury, mercurio] = planets[0];
			Planets.add(mercury, mercurio);
			expect(get(Planets).has(mercury)).toBe(true);
			Planets.delete(mercury);
			expect(get(Planets).has(mercury)).toBe(false);

			const [venus, venusSpanish] = planets[0];
			Planets.add(venus, venusSpanish);
			expect(get(Planets).has(venus)).toBe(true);
			Planets.delete(venus);
			expect(get(Planets).has(venus)).toBe(false);
		});

		it('Should return true if the item was deleted', () => {
			const [[mercury, mercurio], [venus, venusSpanish]] = planets;
			Planets.add(mercury, mercurio);
			expect(Planets.delete(mercury)).toBe(true);
			Planets.add(venus, venusSpanish);
			expect(Planets.delete(venus)).toBe(true);
		});

		it('Should return false if the item was not deleted', () => {
			expect(Planets.delete('sun')).toBe(false);
			expect(Planets.delete('moon')).toBe(false);
		});
	});

	describe('update', () => {
		const Planets = new Hashable<string, string>();
		it('Should have an update method', () => {
			expect(Planets).toHaveProperty('update');
			expect(Planets.update).toBeInstanceOf(Function);
		});

		it('Should update an item', async () => {
			for (const [planet, name] of planets) {
				Planets.add(planet, name);
				Planets.update(planet, (name) => name.toUpperCase());
				expect(get(Planets).get(planet)).toBe(name.toUpperCase());
			}
		});

		it('Should throw if the item is not found', () => {
			const check = () => Planets.update('moon', () => 'luna');
			expect(check).toThrow('Unable to Update Item: Not Found');
		});
	});

	describe('clear', () => {
		const Hash = new Hashable();
		it('Should have a clear method', () => {
			expect(Hash).toHaveProperty('clear');
			expect(Hash.clear).toBeInstanceOf(Function);
		});

		it('Should clear the hash', () => {
			for (const [planet, name] of planets) Hash.add(planet, name);
			expect(get(Hash).size).toBe(planets.length);
			Hash.clear();
			expect(get(Hash).size).toBe(0);
			expect(Array.from(get(Hash).entries())).toHaveLength(0);
		});
	});

	describe('get', () => {
		it('Should have a get method', () => {
			expect(Planets).toHaveProperty('get');
		});
	});

	describe('has', () => {
		it('Should have a has method', () => {
			expect(Planets).toHaveProperty('has');
		});
	});

	describe('size', () => {
		it('Should have a size getter', () => {
			expect(Planets).toHaveProperty('size');
		});
	});
});

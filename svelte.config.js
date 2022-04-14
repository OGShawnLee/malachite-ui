import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					'@predicate': path.resolve('src/lib/predicate'),
					'@predicate/*': path.resolve('src/lib/predicate/*'),
					'@stores': path.resolve('src/lib/stores'),
					'@stores/*': path.resolve('src/lib/stores/*')
				}
			}
		}
	}
};

export default config;

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
					'@components': path.resolve('src/lib/components'),
					'@components/*': path.resolve('src/lib/components/*'),
					'@hooks': path.resolve('src/lib/hooks'),
					'@hooks/*': path.resolve('src/lib/hooks/*'),
					'@predicate': path.resolve('src/lib/predicate'),
					'@predicate/*': path.resolve('src/lib/predicate/*'),
					'@stores': path.resolve('src/lib/stores'),
					'@stores/*': path.resolve('src/lib/stores/*'),
					'@utils': path.resolve('src/lib/utils'),
					'@utils/*': path.resolve('src/lib/utils/*')
				}
			}
		}
	}
};

export default config;

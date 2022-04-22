import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import preprocess from 'svelte-preprocess';
import windicss from 'vite-plugin-windicss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		vite: {
			plugins: [windicss()],
			resolve: {
				alias: {
					'@test-utils': path.resolve('src/test-utils'),
					'@test-utils/*': path.resolve('src/test-utils/*')
				}
			}
		}
	}
};

export default config;

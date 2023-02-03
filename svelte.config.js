import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'@app': 'src/app',
			'@app/*': 'src/app/*',
			'@test-utils': 'src/test-utils',
			'@test-utils/*': 'src/test-utils/*'
		}
	}
};

export default config;

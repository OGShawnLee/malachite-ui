import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	resolve: {
		alias: {
			$lib: resolve('src/lib'),
			'$lib/*': resolve('src/lib/*'),
			'@test-utils': resolve('src/test-utils'),
			'@test-utils/*': resolve('src/test-utils/*')
		}
	},
	test: {
		globals: true,
		environment: 'jsdom'
	}
});

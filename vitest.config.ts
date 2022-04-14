import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	resolve: {
		alias: {
			$lib: resolve('src/lib'),
			'$lib/*': resolve('src/lib/*')
		}
	},
	test: {
		globals: true,
		environment: 'jsdom'
	}
});

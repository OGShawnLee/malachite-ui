import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	resolve: {
		alias: {
			$lib: resolve('src/lib'),
			'$lib/*': resolve('src/lib/*'),
			'@components': resolve('src/lib/components'),
			'@components/*': resolve('src/lib/components/*'),
			'@hooks': resolve('src/lib/hooks'),
			'@hooks/*': resolve('src/lib/hooks/*'),
			'@predicate': resolve('src/lib/predicate'),
			'@predicate/*': resolve('src/lib/predicate/*'),
			'@stores': resolve('src/lib/stores'),
			'@stores/*': resolve('src/lib/stores/*'),
			'@test-utils': resolve('src/test-utils'),
			'@test-utils/*': resolve('src/test-utils/*'),
			'@utils': resolve('src/lib/utils'),
			'@utils/*': resolve('src/lib/utils/*')
		}
	},
	test: {
		globals: true,
		environment: 'jsdom'
	}
});

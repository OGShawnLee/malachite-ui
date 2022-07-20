import windicss from 'vite-plugin-windicss';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit(), windicss()],
	resolve: {
		alias: {
			'@test-utils': resolve('src/test-utils'),
			'@test-utils/*': resolve('src/test-utils/*')
		}
	}
});

import WindiCSS from 'vite-plugin-windicss';
import { defineConfig } from 'vite';
import { sveltekit as SvelteKit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [SvelteKit(), WindiCSS()]
});

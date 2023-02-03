import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
	shortcuts: {
		'layout-length': 'md:max-w-2xl lg:max-w-4xl xl:max-w-6xl',
		'max-w-fit': 'max-w-[fit-content]'
	},
	theme: {
		fontFamily: {
			roboto: ['Roboto', 'sans-serif'],
			poppins: ['Poppins', 'sans-serif']
		}
	}
});

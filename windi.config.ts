import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
	shortcuts: {
		'max-w-fit': 'max-w-[fit-content]',
		button: 'max-w-fit | border-2 outline-none shadow-lg hover:bg-neutral-700 focus:border-white',
		'button--small': 'px-6 py-1.25 | border-neutral-700 font-medium text-sm',
		'button--medium': 'px-8 py-2 | border-transparent bg-neutral-800 font-medium hover:text-white',
		'layout-length': 'md:max-w-2xl lg:max-w-4xl xl:max-w-6xl',
		panel: 'p-8 | grid gap-3 | bg-neutral-800',
		'panel--modal': 'fixed z-10 | transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
		overlay: 'fixed inset-0 | bg-black/90 backdrop-filter backdrop-blur-1px'
	},
	theme: {
		fontFamily: {
			roboto: ['Roboto', 'sans-serif'],
			poppins: ['Poppins', 'sans-serif']
		}
	}
});

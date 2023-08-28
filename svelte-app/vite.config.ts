import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';


export default defineConfig({
	plugins: [sveltekit(), nodeResolve({ browser: true })],
	resolve: {
		alias: {
			buffer: 'buffer'
		}
	},
	define: {
		'process.env': process.env,
		'process.browser': true,
		Buffer: 'buffer'
	},
});

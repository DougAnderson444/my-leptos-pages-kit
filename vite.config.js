import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import rust from '@wasm-tool/rollup-plugin-rust';
import { serverPath } from './svelte.config.js';

export default defineConfig({
	plugins: [
		rust({
			serverPath: serverPath + '/' // for github pages
		}),
		sveltekit()
	],
	optimizeDeps: { exclude: ['./rust/*'] }, // doesnt work, does not exclude ./rust/Cargo.toml from ssrTransformation
	ssr: { external: ['./rust/*'] }, // doesnt work, does not exclude ./rust/Cargo.toml from ssrTransformation
	server: { fs: { strict: false } }
});

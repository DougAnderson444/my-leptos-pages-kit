import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import rust from '@wasm-tool/rollup-plugin-rust';
import { serverPath } from './svelte.config.js';

export default defineConfig({
	plugins: [
		rust({
			serverPath: serverPath + '/', // for github pages
			// Extra arguments passed to `cargo build`.
			cargoArgs: [], // '--release' for smaller builds
			// Extra arguments passed to `wasm-bindgen`.
			wasmBindgenArgs: [],
			watchPatterns: ['rust/src/**']
		}),
		sveltekit()
	],
	server: { fs: { strict: false } }
});

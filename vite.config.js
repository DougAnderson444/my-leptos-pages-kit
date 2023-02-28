import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import rust from '@wasm-tool/rollup-plugin-rust';

export default defineConfig({
	plugins: [rust(), sveltekit()],
	optimizeDeps: { exclude: ['./rust/*'] }, // doesnt exclude ryst/Cargo.toml from ssrTrnsformation
	ssr: { external: ['./rust/*'] }, // doesnt exclude ryst/Cargo.toml from ssrTrnsformation
	server: { fs: { strict: false } }
});

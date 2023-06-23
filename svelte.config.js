// import adapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-static'; // if no server side code, works for both github and cloudflare
import { vitePreprocess } from '@sveltejs/kit/vite';
import { spawn } from 'child_process';

export const serverPath = '/my-leptos-pages-kit';
const dev = process.argv.includes('dev');

// spawm a nodejs command for `tailwindcss -i ./src/style/app.css -o ./src/style/output.css --watch`
const tailwind = spawn('node', [
	'./node_modules/tailwindcss/lib/cli.js',
	'-i',
	'./src/style/app.css',
	'-o',
	'./src/style/output.css',
	dev ? '--watch' : ''
]);

tailwind.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});
tailwind.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});
tailwind.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});

// close tailwind process on exit
process.on('exit', () => {
	tailwind.kill();
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			pages: 'docs', // github pages
			assets: 'docs', // github pages
			fallback: 'index.html' // for static site prerendering
		}),
		paths: {
			base: serverPath // process.env.NODE_ENV === 'development' || process.argv.includes('dev') ? '' : serverPath
		}
	}
	// preprocess: vitePreprocess() // will preprocess our tailwindcss
};

export default config;

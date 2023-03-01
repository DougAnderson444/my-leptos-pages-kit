# Deploy Leptos Github/Cloudflare Pages via (Svelte)Kit

A web app powered by Leptos, bundled by Vite, and adapted by Sveltekit.

## Start with Sveltekit

Wait, I thought this was a Rust article, what's with the Javascript framework?!

Yep... but the way Cloudflare deploys Pages is using Workers, which uses WebAssembly, which uses V8, which is a javascript engine. So there's no getting around javascript for this setup.

Second, Sveltekit has already done a lot of the heavy lifting for us by having an adapter already built for Cloudflare Pages. This will save us time and headaches when deploying to Cloudflare.

Third, we get the benefits of a PWA with a framework such as 'kit. That said, as much as I love Svelte, there's actually very little Svelte or JS needed to initialize Wasm, so hardcore purists can rest easy ;)

### Create Svelte App

`npm create svelte@latest my-leptos-pages-kit`

### Install and add the cloudflare adapter:

`npm i -D @sveltejs/adapter-cloudflare`

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

Now our app will compile and deploy to Cloudflare pages!

## Next, add WebAssembly (wasm) tooling:

This step allows us to wire up our app with rust + wasm using a rollup plugin.

`npm install --save-dev @wasm-tool/rollup-plugin-rust`

then add to `vite.config.js` plugins, as most Rollupjs plugins are compatible with Vite:

```js
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import rust from '@wasm-tool/rollup-plugin-rust';

export default defineConfig({
	plugins: [rust(), sveltekit()]
});
```

## Add Rust Code

Now we can add some Rust to our project that will be available via wasm.

Using the `wasm-tool` plugin is as simple as importing the `Cargo.toml` path into the app via a component, so we'll need:

1. A `./rust/` folder, with our `./rust/Cargo.toml` & `./rust/src/` code
2. A "Mounting Component" to load in our Rust code from Svelte homepage router.

Let's use the [Counter Leptos](// https://github.com/leptos-rs/leptos/blob/main/examples/counter/src/lib.rs) to get started.

`wasm-tool` only allows imports of Rust libraries (`"cdylib"`) so we will need to add `crate-type` as well as `wasm-bindgen` so we can call our library function from javascript. Otherwise, the Cargo.toml is nearly the same as in the Leptos repo example:

```toml
// ./rust/Cargo.toml
[package]
name = "counter"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
leptos = { git = "https://github.com/leptos-rs/leptos" }
console_log = "0.2"
log = "0.4"
console_error_panic_hook = "0.1.7"
wasm-bindgen = "0.2.58"
```

Next we add the [Counter Leptos](// https://github.com/leptos-rs/leptos/blob/main/examples/counter/src/lib.rs) code in the `rust/src` directory. Instead of using the `main.rs` file, we include the call to `main_js` in our library, so we can access it using `wasm-tool`. Since we want to have wasm-bindgen mount our app right away, we will use the `start` option for `main_js`:

```rs
// ./rust/src/lib.rs

use leptos::*;
use wasm_bindgen::prelude::*;

/// A simple counter component.
///
/// You can use doc comments like this to document your component.
#[component]
pub fn SimpleCounter(
    cx: Scope,
    /// The starting value for the counter
    initial_value: i32,
    /// The change that should be applied each time the button is clicked.
    step: i32,
) -> impl IntoView {
    let (value, set_value) = create_signal(cx, initial_value);

    view! { cx,
        <div>
            <button on:click=move |_| set_value(0)>"Clear"</button>
            <button on:click=move |_| set_value.update(|value| *value -= step)>"-1"</button>
            <span>"Value: " {value} "!"</span>
            <button on:click=move |_| set_value.update(|value| *value += step)>"+1"</button>
        </div>
    }
}

// Let bindgen mount the component to the DOM body for us
#[wasm_bindgen(start)]
pub fn main_js() {
    _ = console_log::init_with_level(log::Level::Debug);
    console_error_panic_hook::set_once();
    mount_to_body(|cx| {
        view! { cx,
            <SimpleCounter
                initial_value=0
                step=1
            />
        }
    })
}
```

## Importing Cargo.toml within .js

Now that we have our rust code, we can import and have it called from our main Component in svelte:

```svelte
<script>
	import { onMount } from 'svelte';
	import wasm from '../../rust/Cargo.toml';

	// Use Svelte to load the wasm for us:
	onMount(async () => await wasm());
</script>

// ./src/routes/+page.svelte
```

Now if we `npm run build` the `wasm-tool` will bundle our Rust code up for us, and Svelte will call `bindgen` which in turn will automatically start `main_js` for us, mounting our Leptos app to the DOM!

## How cool is that?!

Pretttty cool. But the main benefit of using Pages (instead of Workers) is we can have _static assets_ like any regular web page. So let's add some assets and see how that works.

What if we replace the words of "-1" and "+1" with some **images**, like `"/increase.png"` and `"/decrease.png"`?

Save a couple of images to `./static` directory and we have them available inour final app.

For Github pages, our app will be located at `github.io/my-leptos-pages-kit` so we need to add this base path to our image path.

Adding a `./.cargo/config.toml` enables us to configure a base path for Github pages

```toml
[env]
BASE_PATH = "/my-leptos-pages-kit/"  # Github pages base path
```

So when we build for Github pages (not needed for Cloudflare Pages) we would reference our static assets like this:

```rs
// rust/src/lib.rs
let base: &str = env!("BASE_PATH");

// ... inside Leptos marco ... //

<img src={base.to_owned() + "decrease.png"} width="100%" />

```

### Add a Tailwindcss

That's good, but they are way too big. Let's add some Tailwindcss in there to easily control the size to a more manageable level.

We want to watch the css in the rust files, but have Sveltekit include the css in our Cloudflare build.

#### Add Tailwind to Sveltekit build pipeline

To ensure our Cloudflare Leptos Page gets the css file, let's follow the standard Tailwind procedure [for adding it to Kit](https://tailwindcss.com/docs/guides/sveltekit) with some adjustments to watch and transform the rust files.

```cli
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init tailwind.config.cjs -p
```

Then add `./src/style/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Use a script that will run Tailwindcss on our Rust files:

`npx tailwindcss -i ./src/style/app.css -o ./src/style/output.css --watch`

Finally, add the css output to the Svelte Component, typically done via a default layout:

```svelte
<!-- ./src/routes/+layout.svelte -->
<script>
	import '../style/output.css';
</script>

<slot />
```

#### Add `.rs` files to `tailwind.config.js`

Which watches for `.rs` files (our Leptos code with some embedded css in it!)

```js
// ./tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './rust/**/*.rs', '*.html'],
	theme: {
		extend: {}
	},
	plugins: []
};
```

Vite would watch our `.js` files but we need Tailwindcss to watch our `.rs` files via the config, so instead of relying on Vite, let's watch using:

`npx tailwindcss -i ./input.css -o ./style/output.css --watch`

Now we can add some Tailwindcss classes to our Hybrid app:

```js
// rust/src/lib.rs
<div class="w-16 h-auto p-1 m-1">
	<img src={base.to_owned() + 'decrease.png'} width="100%" />
</div>
```

## Dev notes

Run `npm run build` and `npm run preview` to watch it happen!

TODO: Better dev setup. As of right now, `vite dev` [does not work](https://github.com/wasm-tool/rollup-plugin-rust/issues/36) with `rollup-plugin-rust`, so there's likely a better way to do development like how standard Leptos apps use Trunk. But for build and deployment, this pipeline works fine :)

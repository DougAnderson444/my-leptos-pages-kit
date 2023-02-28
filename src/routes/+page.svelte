<script>
	import { onMount } from 'svelte';
	import wasm from '../../rust/Cargo.toml';

	// Use Svelte to load the wasm for us:
	onMount(async () => await wasm());
</script>

<!-- Leptos ./rust/src/main.rs should mount our counter here for us -->

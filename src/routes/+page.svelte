<script>
	import { onMount } from 'svelte';
	import wasm from '../../rust/Cargo.toml';

	(async () => await wasm())(); // Leptos is isomorphic, so it's ok to load in both server and client?
</script>

<!-- Leptos ./rust/src/main.rs should mount our counter here for us -->

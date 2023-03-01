<script>
	import { onMount } from 'svelte';
	import wasm from '../../rust/Cargo.toml';

	// Load the wasm
	(async () => await wasm())();

</script>

<!-- Leptos ./rust/src/main.rs should mount our counter here for us -->

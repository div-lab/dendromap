<script>
	import Divider from "./Divider.svelte";

	export let style = "";
</script>

<h1 {style} class="header-component">
	<slot />
</h1>
<Divider />

<style>
	.header-component {
		font-weight: 700;
		font-size: 35px;
		margin-bottom: 5px;
		margin-top: 25px;
	}
</style>

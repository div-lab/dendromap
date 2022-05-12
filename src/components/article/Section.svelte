<script>
	import Divider from "./Divider.svelte";

	export let style = "";
	export let id = "";
</script>

<h1 {style} class="header-component" {id}>
	<slot />
</h1>
<Divider />

<style>
	.header-component {
		font-weight: 600;
		font-size: 28px;
		padding-bottom: 0px;
		margin-bottom: 10px;
		margin-top: 30px;
	}
</style>

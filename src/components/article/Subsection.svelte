<script>
	import Divider from "./Divider.svelte";

	export let style = "";
	export let dividerProps = {};
	export let id = "";
</script>

<h2 {style} class="subheader-component" {id}>
	<slot />
</h2>
<Divider {...dividerProps} />

<style>
	.subheader-component {
		font-weight: 600;
		font-size: 21px;
		padding-bottom: 0px;
		margin-bottom: 10px;
		margin-top: 30px;
	}
</style>

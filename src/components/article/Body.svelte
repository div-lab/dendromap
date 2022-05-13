<script>
	export let style = "";
	export let id = "";
</script>

<p {style} {id} class="body-component">
	<slot />
</p>

<style>
	.body-component {
		line-height: 1.75;
		font-size: 17px;
		color: #3f3f3f;
	}
</style>

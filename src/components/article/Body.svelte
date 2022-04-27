<script>
	export let style = "";
</script>

<p {style} class="body-component">
	<slot />
</p>

<style>
	.body-component {
		line-height: 1.75;
		font-size: 19px;
	}
</style>

<script>
	export let center = false;
</script>

<div class:center>
	<slot />
</div>

<style>
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

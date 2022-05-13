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
	div {
		margin-top: 30px;
		margin-bottom: 15px;
	}
</style>

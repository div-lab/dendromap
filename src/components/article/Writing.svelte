<script>
	export let outerStyle = "";
	export let innerStyle = "";
</script>

<div {outerStyle} id="article-container">
	<div {innerStyle} class="article-text">
		<slot />
	</div>
</div>

<style>
	#article-container {
		display: flex;
		justify-content: center;
		padding-top: 20px;
	}
	.article-text {
		width: 550px;
		/* border: 1px solid rgba(0, 0, 0, 0.034); */
	}
</style>

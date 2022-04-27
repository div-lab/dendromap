<script>
	import DendroMap from "./DendroMap.svelte";
	/* Put stuff here */
</script>

<div id="article-container">
	<div class="article-text">
		<h1 id="article-start">What is <DendroMap />?</h1>
		<p>Some example text;</p>
	</div>
</div>

<style>
	/*  put stuff here */
	#article-container {
		display: flex;
		justify-content: center;
		padding-top: 20px;
	}
	.article-text {
		width: 800px;
		border: 1px solid red;
	}
	h1 {
		font-size: 35px;
	}
	p {
		line-height: 1.1;
		font-size: 19px;
	}
</style>

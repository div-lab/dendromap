<script>
	export let width = "150px";
	export let height = "60px";
	export let backgroundColor = "#06B5DC10";
	export let color = "#06B5DC";
	export let href = "";
</script>

<a {href}>
	<div
		class="preview-container no-select"
		style="width: {width}; height: {height}; background-color: {backgroundColor}; border: {color} 2px solid; "
	>
		<div class="preview-text" style="color: #06B5DC;">
			<slot />
		</div>
	</div>
</a>

<style>
	.preview-container:hover {
		box-shadow: 0px 0 3px 3px rgba(0, 0, 0, 0.1);
	}
	.preview-container {
		/*  */
		border-radius: 3px;
		padding: 10px;
	}
	.preview-text {
		/* font-size: 30px; */
	}
	a {
		text-decoration: none;
	}
</style>

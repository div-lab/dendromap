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
		style="width: {width}; height: {height}; background-color: {backgroundColor}; border-color: {color}; "
	>
		<div class="preview-text" style="color: #06B5DC;">
			<slot />
		</div>
	</div>
</a>

<style>
	.preview-container:hover {
		box-shadow: 0px 2px 3px 3px rgba(0, 0, 0, 0.1);
	}
	.preview-container {
		border-radius: 3px;
		padding: 10px;
		transition: 100ms box-shadow ease-in-out;
		border-width: 1.5px;
		border-style: solid;
	}
	.preview-text {
		/* font-size: 30px; */
	}
	a {
		text-decoration: none;
	}
</style>

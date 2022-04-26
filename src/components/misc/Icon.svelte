<script>
	export let name = "paper";
	export let extension = "svg";
	export let alt = name;
	export let width = "25px";
	export let height = width;
	export let path = "icons/";
	export let canDrag = false;
</script>

<img
	class="custom-icon"
	{alt}
	src={`${path}${name}.${extension}`}
	{width}
	{height}
	class:no-drag={!canDrag}
/>

<style>
	.custom-icon {
	}
	.no-drag {
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-user-drag: none;
		user-drag: none;
		-webkit-touch-callout: none;
	}
</style>

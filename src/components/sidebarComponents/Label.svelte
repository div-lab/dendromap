<script>
	export let label = "Default Label";
	export let outerDivStyle = "";
</script>

<div style={outerDivStyle} class="label-container">
	<label class="text-label">{label}</label>
	<div class="item-container"><slot /></div>
</div>

<style>
	.label-container {
		margin-top: 5px;
		border: 0.2px solid transparent;
	}
	/* was for development purposes and positioning */
	/* .label-container:hover {
		border: 0.2px solid rgba(0, 0, 0, 0.1);
	} */
	.text-label {
		font-weight: 600;
	}
	.item-container {
		margin-top: 2px;
	}
</style>

<script>
	export let label = "Default Label";
	export let outerDivStyle = "";
	export let textStyle = "";
</script>

<div style={outerDivStyle}>
	<label class="text-label" style={textStyle}>{label}</label>
	<div class="item-container"><slot /></div>
</div>

<style>
	.text-label {
		font-weight: 600;
		font-size: 17px;
		color: var(--clear-grey);
	}
	.item-container {
		margin-top: 0px;
	}
</style>

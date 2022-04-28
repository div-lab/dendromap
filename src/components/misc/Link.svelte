<script>
	export let openNewTab = false;
	export let href;
	export let style = "";
</script>

<a target={openNewTab ? "_blank" : ""} {href} {style}><slot /></a>

<style>
	a {
		border-bottom-color: hsla(206, 90%, 20%, 0.3);
		font-size: 0.85em;
		color: hsla(206, 90%, 20%, 0.7);
		text-decoration: none;
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}
	a:hover {
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: hsla(206, 90%, 20%, 0.7);
		color: hsla(206, 90%, 20%, 1);
	}
</style>

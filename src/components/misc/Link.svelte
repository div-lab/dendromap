<script>
	export let openNewTab = false;
	export let href;
	export let style = "";
</script>

<a target={openNewTab ? "_blank" : ""} {href} {style}><slot /></a>

<style>
	a {
		--h: 0;
		--s: 0%;
		--l: 0%;
		--a-underline: 0.3;
		--a-text: 0.7;
		border-bottom-color: hsla(
			var(--h),
			var(--s),
			var(--l),
			var(--a-underline)
		);
		font-size: 0.9em;
		color: hsla(var(--h), var(--s), var(--l), var(--a-text));
		text-decoration: none;
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}
	a:hover {
		border-bottom-width: 1px;
		border-bottom-style: solid;
		--a-underline: 0.7;
		--a-text: 1;
	}
</style>

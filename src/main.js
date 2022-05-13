import App from "./App.svelte";
import options from "./dataOptions";

const app = new App({
	target: document.body,
	props: {
		options,
		silenceConsole: true,
	},
});

export default app;

import App from "./App.svelte";

const app = new App({
	target: document.body,
	props: {
		pathToDir: "https://div-lab.github.io/dendromap-data/",
		clustersSubDirName: "clusters",
		classClustersSubDirName: "clusters/classes",
		imagesSubDirName: "images",
	},
});

export default app;

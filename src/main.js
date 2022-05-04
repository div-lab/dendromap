import App from "./App.svelte";

const app = new App({
	target: document.body,
	props: {
		options: [
			{
				dataset: "cifar10",
				model: "resnet50",
				cluster_filepath: "testcifar10-str.json",
				class_cluster_filepath: undefined,
				image_filepath:
					"https://div-lab.github.io/dendromap-data/cifar10/images",
			},
			{
				dataset: "cifar100",
				model: "resnet50",
				cluster_filepath:
					"https://div-lab.github.io/dendromap-data/cifar100/clusters/result_tree_and_nodes_resnet50_0_81.json",
				classes_cluster_filepath: undefined,
				image_filepath:
					"https://div-lab.github.io/dendromap-data/cifar100/images",
			},
			{
				dataset: "cifar100",
				model: "Autoencoder",
				cluster_filepath: "",
				classes_cluster_filepath: undefined,
				image_filepath: "",
			},
			// put your entry here
		],
	},
});

export default app;

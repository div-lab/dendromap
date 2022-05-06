import App from "./App.svelte";

const app = new App({
	target: document.body,
	props: {
		options: [
			{
				dataset: "CIFAR-10",
				model: "ResNet-50",
				cluster_filepath:
					"https://div-lab.github.io/dendromap-data/cifar10/clusters/cifar10_resnet50.json",
				class_cluster_filepath:
					"https://div-lab.github.io/dendromap-data/cifar10/clusters/cifar10_resnet50_classes.json",
				image_filepath:
					"https://div-lab.github.io/dendromap-data/cifar10/images",
			},
			{
				dataset: "MNIST",
				model: "VAE",
				cluster_filepath:
					"https://div-lab.github.io/dendromap-data/mnist/clusters/vae_mnist_clusters.json",
				classes_cluster_filepath: undefined,
				image_filepath:
					"https://div-lab.github.io/dendromap-data/mnist/images",
			},
			{
				dataset: "CIFAR-100",
				model: "ResNet-50",
				cluster_filepath:
					"https://div-lab.github.io/dendromap-data/cifar100/clusters/result_tree_and_nodes_resnet50_0_81.json",
				classes_cluster_filepath: undefined,
				image_filepath:
					"https://div-lab.github.io/dendromap-data/cifar100/images",
			},
			// put your entry here
		],
	},
});

export default app;

const options = [
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
		dataset: "CIFAR-100",
		model: "ResNet-50",
		cluster_filepath:
			"https://div-lab.github.io/dendromap-data/cifar100/clusters/cifar100_resnet50.json",
		class_cluster_filepath:
			"https://div-lab.github.io/dendromap-data/cifar100/clusters/cifar100_resnet50_classes.json",
		image_filepath:
			"https://div-lab.github.io/dendromap-data/cifar100/images",
	},
	{
		dataset: "MNIST",
		model: "VAE",
		cluster_filepath:
			"https://div-lab.github.io/dendromap-data/mnist/clusters/vae_mnist_clusters.json",
		classes_cluster_filepath: undefined,
		image_filepath: "https://div-lab.github.io/dendromap-data/mnist/images",
	},
	// put your entry here and it will show up in the dropdown menu
];

export default options;

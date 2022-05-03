'''
    util.py - houses the code for random util functions
              for the data generation process
'''
import numpy as np
from scipy.cluster.hierarchy import linkage


class Node:
    def __init__(self, data):
        self.data = data
        self.children = None
        self.leaf = False
        self.parent = None

    def __repr__(self):
        return f"Node(data={self.data})"

    @property
    def dict(self):
        return {"data": self.data, "parent": self.parent, "children": self.children, "leaf": self.leaf}


class Dendrogram:
    def __init__(self, root=None):
        self.root = root
        self.cache = {}

    @property
    def leaves(self):
        leaves_key = "leaves"
        if leaves_key in self.cache:
            return self.cache[leaves_key]
        else:
            return get_leaves(self.root)

    @property
    def dict(self):
        dict_key = "dict"
        if dict_key in self.cache:
            return self.cache[dict_key]
        else:
            root_dict = self.root.dict

            def _dictify(children):
                if children is None:
                    return
                for child in children:
                    child = child.dict
                    _dictify(child["children"])

            _dictify(root_dict["children"])

            return root_dict

    def clear_cache(self):
        self.cache = {}

    def new_root(self, new_root):
        self.clear_cache()
        self.root = new_root


def get_leaves(parent):
    result = []

    def _leaves(node):
        if node.leaf:
            result.append(node)
            return
        for child in node.children:
            _leaves(child)
    _leaves(parent)
    return result


def compute_closest():
    pass


def hierarchical_cluster(features: np.ndarray, *args, **kwargs):
    clusters = linkage(features, *args, **kwargs)
    return clusters


def get_cluster_func(features):
    offset = len(features) + 1
    return lambda index: int(index - offset)


def merge_clusters_func(get_cluster_callback):
    return lambda node: [get_cluster_callback(node.data[0]), get_cluster_callback(node.data[1])]


def construct_dendrogram(clusters: np.ndarray, features: np.ndarray):
    get_cluster = get_cluster_func(features)
    # resolves which clusters to move from clusters
    get_merger = merge_clusters_func(get_cluster)

    def build(parent: Node):
        resolve_merge = get_merger(parent)
        parent.children = [Node(None), Node(None)]
        for i, child_idx in enumerate(resolve_merge):
            parent.children[i].parent = parent  # connect upwards too
            if child_idx < 0:
                parent.children[i].data = parent.data[i]
                parent.children[i].leaf = True
            else:
                parent.children[i].data = features[child_idx]
                build(parent.children[i])

    dendrogram = Dendrogram()
    dendrogram.root = Node(features[-1])
    build(dendrogram.root)

    return dendrogram


def export_dendrogram(dendrogram):
    pass


def compute_accuracy(dendrogram):
    pass


def add_attr(json, attr_name, data):
    json[attr_name] = data


if __name__ == "__main__":
    print("working")
    a = Dendrogram()

import { Kubectl } from "../../../kubectl";
import * as kubectlUtils from '../../../kubectlUtils';
import * as kuberesources from '../../../kuberesources';
import { ResourceNode } from "../node.resource";
import { ClusterExplorerNode } from "../node";
import { SimpleGroupingFolder } from "../node.folder.grouping";

export const nodePodsChildSource = {
    async children(kubectl: Kubectl, parent: ResourceNode): Promise<ClusterExplorerNode[]> {
        const pods = await kubectlUtils.getPods(kubectl, null, 'all');
        const filteredPods = pods.filter((p) => {
            if (p.nodeName === "<none>" && parent.kindName === "node/Nodeless") {
                return true;
            }
            if (parent.kindName === "node/All") {
                return true;
            }

            return `node/${p.nodeName}` === parent.kindName;
        });

        const namespaces = new Set(filteredPods.map((p) => p.namespace));

        return Array.from(namespaces).map((ns) => {
            return new SimpleGroupingFolder(
                ns,
                ns,
                filteredPods.filter((p) => p.namespace === ns).map(
                    (p) => ResourceNode.create(kuberesources.allKinds.pod, p.name, p.metadata, { podInfo: p })
                )
            );
        });
    }
};

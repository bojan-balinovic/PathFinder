import { NodeUIData } from '../interfaces/node-ui-data';
import { Algorithm } from '../abstract-models/algorithm';
import { GridComponent } from '../components/grid/grid.component';

export class NodeUI implements NodeUIData {
  index: number;
  x: number;
  y: number;
  row: number;
  col: number;
  borderRadius: number = 0;
  scale: number = 1;

  accessible?: boolean = true;

  constructor(props?: NodeUIData) {
    Object.assign(this, props);
  }

  toggleAccessibility(algorithm: Algorithm) {
    this.accessible = !this.accessible;
    let cost = this.accessible ? 1 : Infinity;
    let graph = algorithm.getGraph();
    graph.forEach((node, nodeIndex) => {
      if (graph[nodeIndex].find((edge) => edge.to == this.index)) {
        algorithm.updateEdge(nodeIndex, this.index, cost);
      }
    });
    if (!this.accessible) {
      this.scale = 0;
      this.borderRadius = GridComponent.rectHeight;
    } else {
      this.scale = 1;
      this.borderRadius = 0;
    }
  }
}

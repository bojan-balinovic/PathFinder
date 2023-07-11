import { NodeUIData } from '../interfaces/node-ui-data';
import { Algorithm } from '../abstract-models/algorithm';

export class NodeUI implements NodeUIData {
  index: number;
  x: number;
  y: number;
  row: number;
  col: number;
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
  }
}

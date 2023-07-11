import { NodeUIData } from '../interfaces/node-ui-data';
import { Graph } from 'src/app/types/graph';
import { Dijkstra } from './dijkstra';

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

  toggleAccessibility(dijkstra: Dijkstra) {
    this.accessible = !this.accessible;
    let cost = this.accessible ? 1 : Infinity;
    dijkstra.graph.forEach((node, nodeIndex) => {
      if (dijkstra.graph[nodeIndex].find((edge) => edge.to == this.index)) {
        dijkstra.updateEdge(nodeIndex, this.index, cost);
      }
    });
  }
}

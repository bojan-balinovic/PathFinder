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

  constructor(private selectedAlgorithm: Algorithm, props?: NodeUIData) {
    Object.assign(this, props);
  }

  // IF ACCESSIBLE IS TRUE, THIS NODE BECOMES AN OBSTACLES.
  // AN OBSTACLE IS A NODE THAT HAS EDGE WITH INFINITE EDGE WEIGHT.
  toggleAccessibility() {
    this.accessible = !this.accessible;
    this.setAccesibility(this.accessible);
  }

  // IF ACCESSIBLE IS TRUE, THIS NODE BECOMES AN OBSTACLES.
  //AN OBSTACLE IS A NODE THAT HAS EDGE WITH INFINITE EDGE WEIGHT.
  setAccesibility(state: boolean) {
    this.accessible = state;
    let cost = this.accessible ? 1 : Infinity;
    let graph = this.selectedAlgorithm.getGraph();
    graph.forEach((node, nodeIndex) => {
      if (graph[nodeIndex].find((edge) => edge.to == this.index)) {
        this.selectedAlgorithm.updateEdge(nodeIndex, this.index, cost);
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

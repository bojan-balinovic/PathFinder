import { Algorithm } from '../abstract-models/algorithm';

export class BellmanFordAlgorithm extends Algorithm {
  constructor(n: number) {
    super(n);
  }

  override findShortestPath(start: number, end: number): number[] {
    this.bellmanFord();
    let current = end;
    let path = [];
    while (current != start) {
      path.unshift(current);
      current = this.previousNodes[current];
      if (current == undefined || current == -1) {
        throw new Error('No path');
      }
    }
    path.unshift(start);
    return path;
  }

  bellmanFord(): number[] {
    // Initialize
    this.distances = new Array(this.n).fill(Number.POSITIVE_INFINITY);
    this.distances[0] = 0;

    // Relax edges repeatadly, one cycle is called an iteration. Maximum number of iterations is |V|-1
    for (let i = 0; i < this.n - 1; ++i) {
      for (let sourceNode = 0; sourceNode < this.graph.length; ++sourceNode) {
        for (const edge of this.graph[sourceNode]) {
          let destination = edge.to;
          let weight = edge.cost;
          if (
            this.distances[sourceNode] !== Number.POSITIVE_INFINITY &&
            this.distances[sourceNode] + weight < this.distances[destination]
          ) {
            this.distances[destination] = this.distances[sourceNode] + weight;
            this.previousNodes[destination] = sourceNode;
          }
        }
      }
    }
    return this.distances;
    // TODO: Check for negative weight cycles
  }
}

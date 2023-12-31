import { Algorithm } from 'src/app/abstract-models/algorithm';
import { MinIndexedDHeap } from 'src/app/models/min-indexed-d-heap';

export class DijkstraAlgorithm extends Algorithm {
  constructor(n: number) {
    super(n);
  }

  public findShortestPath(start: number, end: number): Array<number> {
    this.previousNodes = [];
    this.dijkstra(start, end);
    return this.recontstructShortestPath(start, end);
  }

  dijkstra(start: number, end: number) {
    let minQ = new MinIndexedDHeap<number>(this.n);
    minQ.insert(start, 0);

    this.distances = new Array<number>(this.n);
    this.distances.fill(Number.POSITIVE_INFINITY);
    this.distances[start] = 0;

    let visited = new Array<boolean>();

    while (minQ.isEmpty() == false) {
      let nodeId: number = minQ.peekMinIndex() as number;
      visited[nodeId] = true;

      let minValue = minQ.poll() as number;
      if (minValue > this.distances[nodeId]) continue;
      this.graph[nodeId].forEach((edge) => {
        if (visited[edge.to]) return;
        let newDist = this.distances[nodeId] + edge.cost;
        if (newDist < this.distances[edge.to]) {
          this.previousNodes[edge.to] = nodeId;
          this.distances[edge.to] = newDist;

          if (!minQ.contains(edge.to)) minQ.insert(edge.to, newDist);
          else minQ.decrease(edge.to, newDist);
        }
      });
      if (nodeId == end) return;
    }
  }
}

import { VirtualTimeScheduler } from 'rxjs';
import { Edge } from './edge';

export class Dijkstra {
  private n: number;
  private distances: Array<number>;
  private previousNodes: Array<number>;
  private graph: Array<Array<Edge>>;
  private edgeCount: number = 0;

  constructor(n: number) {
    this.n = n;
    this.createEmptyGraph();
  }

  createEmptyGraph() {
    this.graph = new Array();
    for (let i = 0; i < this.n; i++) this.graph[i] = new Array<Edge>();
  }

  addEdge(from: number, to: number, cost: number) {
    this.edgeCount++;
    this.graph[from].push(new Edge(to, cost));
  }
  getGraph() {
    return this.graph;
  }
  dijkstra(start: number, end: number) {
    let degree = this.edgeCount / this.n;
    let minQ = new MinIndexedDHeap<number>(this.n);
    minQ.insert(start, 0);

    this.distances = new Array<number>(this.n);
    this.distances.fill(Number.POSITIVE_INFINITY);
    this.distances[start] = 0;

    let visited = new Array<boolean>();

    this.previousNodes = new Array<number>();

    while (minQ.isEmpty() == false) {
      let nodeId: number = minQ.peekMin() as number;
      visited[nodeId] = true;

      let minValue = minQ.poll() as number;
      if (minValue > this.distances[nodeId]) continue;
      this.graph[nodeId].forEach((edge) => {
        if (visited[edge.to]) return;
        let newDist = this.distances[nodeId] + edge.cost;
        if (newDist < this.distances[edge.to]) {
          this.previousNodes[edge.to] = nodeId;
          this.distances[edge.to] = nodeId;

          if (!minQ.contains(edge.to)) minQ.insert(edge.to, newDist);
          else minQ.decrease(edge.to, newDist);
        }
      });
      if (nodeId == end) return this.distances[end];
    }
  }
}

import { Edge } from './edge';
import { MinIndexedDHeap } from './min-indexed-d-heap';

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

  updateEdge(from: number, to: number, cost: number) {
    this.edgeCount++;
    let idx = this.graph[from].findIndex((e) => e.to == to);
    this.graph[from][idx] = new Edge(to, cost);
  }
  removeEdge(from: number, to: number) {
    let idx = this.graph[from].findIndex((e) => e.to == to);
    this.graph[from].splice(idx, 1);
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
      if (nodeId == end) return this.distances[end];
    }
    return Number.POSITIVE_INFINITY;
  }

  public reconstructPath(start: number, end: number): Array<number> {
    if (end < 0 || end >= this.n) {
      throw new Error('Invalid node index');
    }
    if (start < 0 || start >= this.n) {
      throw new Error('Invalid node index');
    }
    let path = new Array<number>();
    let dist = this.dijkstra(start, end);
    if (dist == Number.POSITIVE_INFINITY) return path;
    for (let at = end; at != null; at = this.previousNodes[at]) {
      path.push(at);
    }
    path = path.reverse();
    return path;
  }
}

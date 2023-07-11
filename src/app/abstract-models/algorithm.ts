import { Edge } from '../models/edge';

export abstract class Algorithm {
  protected n: number;
  protected distances: Array<number>;
  protected previousNodes: Array<number>;
  protected graph: Array<Array<Edge>>;
  protected edgeCount: number = 0;

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
    if (idx == -1) return;
    this.graph[from].splice(idx, 1);
  }

  getGraph() {
    return this.graph;
  }

  abstract findShortestPath(start: number, end: number): Array<number>;
}

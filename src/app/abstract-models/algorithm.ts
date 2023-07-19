import { Edge } from '../models/edge';

export abstract class Algorithm {
  protected n: number;
  protected distances: Array<number>;
  protected previousNodes = new Array<number>();
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
  setGraph(graph: Array<Array<Edge>>) {
    this.graph = graph;
  }

  abstract findShortestPath(start: number, end: number): Array<number>;

  protected recontstructShortestPath(start: number, end: number) {
    if (end < 0 || end >= this.n) {
      throw new Error('Invalid node index');
    }
    if (start < 0 || start >= this.n) {
      throw new Error('Invalid node index');
    }
    let path = new Array<number>();

    for (let at = end; at != null; at = this.previousNodes[at]) {
      path.push(at);
    }

    path = path.reverse();

    // IF NO PATH
    if (
      path.length == 2 &&
      this.graph[path[0]].find((e: Edge) => e.to == path[1]) == undefined
    ) {
      return [];
    }

    return path;
  }
}

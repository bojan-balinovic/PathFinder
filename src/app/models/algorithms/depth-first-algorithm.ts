import Queue from 'simple-queue-typescript';
import { Algorithm } from 'src/app/abstract-models/algorithm';
import { Stack } from '../stack';

export class DepthFirstAlgorithm extends Algorithm {
  constructor(n: number) {
    super(n);
  }

  public findShortestPath(start: number, end: number): Array<number> {
    this.previousNodes = [];
    this.dfs(start);
    return this.recontstructShortestPath(start, end);
  }

  private dfs(start: number) {
    this.previousNodes = new Array(this.n).fill(null);
    let s = new Stack<number>();
    s.push(start);

    let visited = new Array<boolean>(this.n).fill(false);
    visited[start] = true;

    while (s.size() > 0) {
      let currentNode = s.pop() as number;
      for (let edge of this.graph[currentNode]) {
        if (!visited[edge.to] && edge.cost !== Infinity) {
          // IF HAVEN'T VISITED A NEIGHBOR
          s.push(edge.to);
          visited[edge.to] = true;
          this.previousNodes[edge.to] = currentNode;
        }
      }
    }
  }
}

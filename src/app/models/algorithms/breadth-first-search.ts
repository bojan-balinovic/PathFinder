import Queue from 'simple-queue-typescript';
import { Algorithm } from 'src/app/abstract-models/algorithm';

export class BreadthFirstSearch extends Algorithm {
  constructor(n: number) {
    super(n);
  }

  public findShortestPath(start: number, end: number): Array<number> {
    this.previousNodes = [];
    this.bfs(start);
    return this.recontstructShortestPath(start, end);
  }

  private bfs(start: number) {
    let q = new Queue<number>();
    q.enqueue(start);

    let visited = new Array<boolean>(this.n).fill(false);
    visited[start] = true;

    while (q.isEmpty() == false) {
      let currentNode = q.dequeue() as number;
      for (let edge of this.graph[currentNode]) {
        if (!visited[edge.to] && edge.cost !== Infinity) {
          // IF HAVEN'T VISITED A NEIGHBOR
          q.enqueue(edge.to);
          visited[edge.to] = true;
          this.previousNodes[edge.to] = currentNode;
        }
      }
    }
  }
}

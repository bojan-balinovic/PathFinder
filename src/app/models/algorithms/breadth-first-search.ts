import Queue from 'simple-queue-typescript';
import { Algorithm } from 'src/app/abstract-models/algorithm';

export class BreadthFirstSearch extends Algorithm {
  constructor(n: number) {
    super(n);
  }

  public findShortestPath(start: number, end: number): Array<number> {
    let path = new Array<number>();
    this.bfs(start);
    path.push(end);
    for (
      let at = this.previousNodes[end];
      at != null;
      at = this.previousNodes[at]
    ) {
      path.push(at);
    }

    path = path.reverse();

    if (path[0] == start) {
      return path;
    }
    return [];
  }

  private bfs(start: number) {
    this.previousNodes = new Array(this.n).fill(null);
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

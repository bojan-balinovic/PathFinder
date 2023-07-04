export class Edge {
  to: number = 0;
  cost: number = 0;
  constructor(to: number, cost: number) {
    this.to = to;
    this.cost = cost;
  }
}

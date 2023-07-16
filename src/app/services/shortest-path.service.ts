import { Injectable } from '@angular/core';
import { DijkstraAlgorithm } from '../models/dijkstra-algorithm';
import { BellmanFordAlgorithm } from '../models/bellman-ford-algorithm';
import { GridComponent } from '../components/grid/grid.component';
import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';
import { Algorithm } from '../abstract-models/algorithm';

@Injectable({
  providedIn: 'root',
})
export class ShortestPathService {
  private totalNumberOfNodes = GridComponent.rows * GridComponent.cols;

  public availableAlgorithms: Array<any>;
  public selectedAlgorithm: Algorithm;
  public path: number[];
  public startNode: number = 305; // COULD BE ANY NUMBER |V|
  public endNode: number = 324; // COULD BE ANY NUMBER |V|

  constructor() {
    this.initAvailableAlgorithms();

    this.setAlgorithm(this.availableAlgorithms[0].algorithm);

    this.addEdges();
  }

  initAvailableAlgorithms() {
    this.availableAlgorithms = [
      {
        name: 'Dijkstra',
        algorithm: new DijkstraAlgorithm(this.totalNumberOfNodes),
      },
      {
        name: 'Bellman-Ford',
        algorithm: new BellmanFordAlgorithm(this.totalNumberOfNodes),
      },
    ];
  }

  setAlgorithm(alg: Algorithm) {
    // PRESERVE GRAPH AND THAN CHANGE SELECTED ALGORITHM
    const graph = this.selectedAlgorithm?.getGraph();
    this.selectedAlgorithm = alg;
    if (graph) this.selectedAlgorithm.setGraph(graph);
  }

  addEdges() {
    let alg = this.selectedAlgorithm;
    let index = 0;
    for (let i = 0; i < GridComponent.rows; i++) {
      for (let j = 0; j < GridComponent.cols; j++) {
        if (j + 1 < GridComponent.cols) {
          alg.addEdge(index, index + 1, 1);
        }
        if (j > 0) {
          alg.addEdge(index, index - 1, 1);
        }
        if (i > 0) {
          alg.addEdge(index, index - GridComponent.cols, 1);
        }
        if (i + 1 < GridComponent.rows) {
          alg.addEdge(index, index + GridComponent.cols, 1);
        }
        index += 1;
      }
    }
  }

  // MAIN BUSINESS LOGIC
  findShortestPath() {
    try {
      if (this.startNode == undefined || this.endNode == undefined)
        throw new Error('Start or end node not defined.');

      this.path = this.selectedAlgorithm?.findShortestPath(
        this.startNode,
        this.endNode
      );
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
}

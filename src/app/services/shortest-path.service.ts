import { Injectable } from '@angular/core';
import { DijkstraAlgorithm } from '../models/dijkstra-algorithm';
import { BellmanFordAlgorithm } from '../models/bellman-ford-algorithm';
import { NodeUI } from '../models/node-ui';
import { GridComponent } from '../components/grid/grid.component';
import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';
import { Algorithm } from '../abstract-models/algorithm';

@Injectable({
  providedIn: 'root',
})
export class ShortestPathService {
  availableAlgorithms: Array<any>;
  public selectedAlgorithm: Algorithm;
  path: number[];

  constructor() {
    let totalNumberOfNodes = GridComponent.rows * GridComponent.cols;

    this.availableAlgorithms = [
      {
        name: 'Dijkstra',
        algorithm: new DijkstraAlgorithm(totalNumberOfNodes),
      },
      {
        name: 'Bellman-Ford',
        algorithm: new BellmanFordAlgorithm(totalNumberOfNodes),
      },
    ];
    this.selectedAlgorithm = this.availableAlgorithms[0].algorithm;

    this.setAlgorithm(this.availableAlgorithms[0].algorithm);

    this.addEdges();
  }

  setAlgorithm(alg: Algorithm) {
    this.selectedAlgorithm = alg;
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

  findShortestPath() {
    this.path = this.selectedAlgorithm?.findShortestPath(0, 99);
    console.log(this.selectedAlgorithm);
    console.log(this.path);
  }
}

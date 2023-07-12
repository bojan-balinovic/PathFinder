import { Injectable } from '@angular/core';
import { DijkstraAlgorithm } from '../models/dijkstra-algorithm';
import { BellmanFordAlgorithm } from '../models/bellman-ford-algorithm';
import { NodeUI } from '../models/node-ui';
import { GridComponent } from '../components/grid/grid.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { Algorithm } from '../abstract-models/algorithm';

@Injectable({
  providedIn: 'root',
})
export class ShortestPathService {
  availableAlgorithms: Array<any>;
  nodes: NodeUI[] = new Array<NodeUI>();
  _selectedAlgorithm: Algorithm;
  selectedAlgorithm: BehaviorSubject<Algorithm>;
  path: number[];

  constructor() {
    let index = 0;
    for (let i = 0; i < GridComponent.rows; i++) {
      for (let j = 0; j < GridComponent.cols; j++) {
        let x = j * GridComponent.rectWidth;
        let y = i * GridComponent.rectHeight;
        let node = new NodeUI({
          x: x,
          y: y,
          index: index,
          row: i,
          col: j,
        });
        index += 1;
        this.nodes.push(node);
      }
    }

    this.availableAlgorithms = [
      { name: 'Dijkstra', algorithm: new DijkstraAlgorithm(this.nodes.length) },
      {
        name: 'Bellman-Ford',
        algorithm: new BellmanFordAlgorithm(this.nodes.length),
      },
    ];
    this.selectedAlgorithm = new BehaviorSubject<Algorithm>(
      this.availableAlgorithms[0].algorithm
    );
    this.setAlgorithm(this.availableAlgorithms[0].algorithm);

    this.addEdges();
  }

  setAlgorithm(alg: Algorithm) {
    this._selectedAlgorithm = alg;
    this.selectedAlgorithm.next(this._selectedAlgorithm);
  }

  addEdges() {
    let alg = this._selectedAlgorithm;
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
    this.path = this._selectedAlgorithm?.findShortestPath(0, 99);
    console.log(this._selectedAlgorithm);
    console.log(this.path);
  }
}

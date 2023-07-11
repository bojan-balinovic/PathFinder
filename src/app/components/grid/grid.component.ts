import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dijkstra } from 'src/app/models/dijkstra';
import * as p5 from 'p5';
import { NodeUI } from 'src/app/models/node-ui';
import { Algorithm } from 'src/app/abstract-models/algorithm';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  @ViewChild('p5Canvas', { static: true }) p5Canvas: ElementRef;
  private p5Instance: p5;
  rows = 10;
  cols = 10;
  rectWidth = 40;
  rectHeight = 40;
  path: number[];
  nodes: NodeUI[] = new Array<NodeUI>();
  selectedAlgorithm: Algorithm;
  availableAlgorithms: [{ name: string; algorithm: Algorithm }];

  constructor() {}

  ngOnInit(): void {
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let x = j * this.rectWidth;
        let y = i * this.rectHeight;
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
      { name: 'Dijkstra', algorithm: new Dijkstra(this.nodes.length) },
    ];
    this.setAlgorithm(this.availableAlgorithms[0].algorithm);
  }

  ngAfterViewInit() {
    this.createP5Sketch();
  }
  private createP5Sketch() {
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(400, 400).parent(this.p5Canvas.nativeElement);
        this.addEdges();
      };
      p.draw = () => {
        p.background(220);
        this.drawRects(p);
      };
      p.mouseClicked = () => this.mouseClicked(p);
    };
    this.p5Instance = new p5(sketch);
  }
  drawRects(p: p5) {
    this.nodes.forEach((node: NodeUI) => {
      if (!node.accessible) {
        p.fill(255, 0, 0);
      } else if (this.path?.includes(node.index)) {
        p.fill(0);
      } else {
        p.fill(255);
      }
      p.stroke(0);
      p.rect(node.x, node.y, this.rectWidth, this.rectHeight);

      p.stroke(0, 80, 0);
      p.text(node.index, node.x + 5, node.y + 10);
    });
  }
  addEdges() {
    let alg = this.selectedAlgorithm;
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (j + 1 < this.cols) {
          alg.addEdge(index, index + 1, 1);
        }
        if (j > 0) {
          alg.addEdge(index, index - 1, 1);
        }
        if (i > 0) {
          alg.addEdge(index, index - this.cols, 1);
        }
        if (i + 1 < this.rows) {
          alg.addEdge(index, index + this.cols, 1);
        }
        index += 1;
      }
    }
    // this.dijkstra.removeEdge(3, 4);
    // this.dijkstra.removeEdge(5, 4);
    // this.dijkstra.removeEdge(14, 4);
    //this.dijkstra.updateEdge(3, 4, Infinity);
    // this.dijkstra.updateEdge(5, 4, Infinity);
    // this.dijkstra.updateEdge(14, 4, Infinity);
  }
  mouseClicked(p: p5) {
    let row = Math.floor(p.mouseY / this.rectHeight);
    let col = Math.floor(p.mouseX / this.rectWidth);

    if (row < this.rows && col < this.cols) {
      console.log('Clicked on rectangle at row:', row, 'column:', col);
      this.nodes
        .find((n) => n.row == row && n.col == col)
        ?.toggleAccessibility(this.selectedAlgorithm);
      // Add your click event logic here
    }
  }

  findPath() {
    this.path = this.selectedAlgorithm.findShortestPath(0, 99);
    console.log(this.path);
  }
  setAlgorithm(algorithm: Algorithm) {
    this.selectedAlgorithm = algorithm;
  }
}

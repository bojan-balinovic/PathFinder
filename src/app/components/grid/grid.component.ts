import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DijkstraAlgorithm } from 'src/app/models/dijkstra-algorithm';
import * as p5 from 'p5';
import { NodeUI } from 'src/app/models/node-ui';
import { Algorithm } from 'src/app/abstract-models/algorithm';
import { BellmanFordAlgorithm } from 'src/app/models/bellman-ford-algorithm';

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
  public static rectWidth = 40;
  public static rectHeight = 40;
  path: number[];
  nodes: NodeUI[] = new Array<NodeUI>();
  selectedAlgorithm: Algorithm;
  availableAlgorithms: Array<any>;

  constructor() {}

  ngOnInit(): void {
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
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
    this.setAlgorithm(this.availableAlgorithms[1].algorithm);
  }

  ngAfterViewInit() {
    this.createP5Sketch();
  }
  private createP5Sketch() {
    const sketch = (p: p5) => {
      let prevMouseX = p.mouseX;
      let prevMouseY = p.mouseY;
      let mouseDragging = false;

      p.setup = () => {
        p.createCanvas(400, 400).parent(this.p5Canvas.nativeElement);
        this.addEdges();
        p.mouseClicked = () => this.mouseClicked(p, mouseDragging);
        p.mouseDragged = () => {
          mouseDragging = true;
          this.mouseDragged(p, prevMouseX, prevMouseY);
        };
        p.mouseReleased = () => {
          mouseDragging = false;
        };
      };
      p.draw = () => {
        prevMouseX = p.mouseX;
        prevMouseY = p.mouseY;
        p.background(220);
        this.drawRects(p);
      };
    };
    this.p5Instance = new p5(sketch);
  }
  drawRects(p: p5) {
    this.nodes.forEach((node: NodeUI) => {
      if (!node.accessible) {
        p.fill(255, 0, 0);

        // if ((node.borderRadius as number) > 0) {
        //   (node.borderRadius as number) -= 5;
        // } else {
        //   node.borderRadius = 0;
        // }

        if (node.scale < 1) {
          node.scale += 0.1;
        } else {
          node.scale = 1;
        }
      } else if (this.path?.includes(node.index)) {
        p.fill(0);
      } else {
        p.fill(255);
      }
      p.push();

      p.stroke(0);

      p.translate(
        node.x + GridComponent.rectWidth / 2,
        node.y + GridComponent.rectHeight / 2
      );
      p.scale(node.scale);
      p.rect(
        -GridComponent.rectWidth / 2,
        -GridComponent.rectHeight / 2,
        GridComponent.rectWidth,
        GridComponent.rectHeight
      );
      p.translate(
        -node.x + GridComponent.rectWidth / 2,
        -node.y + GridComponent.rectHeight / 2
      );
      p.pop();
      p;
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
  mouseClicked(p: p5, mouseDragging: boolean) {
    if (mouseDragging == true) return;
    let row = Math.floor(p.mouseY / GridComponent.rectHeight);
    let col = Math.floor(p.mouseX / GridComponent.rectWidth);

    if (row < this.rows && col < this.cols) {
      console.log('Clicked on rectangle at row:', row, 'column:', col);
      this.nodes
        .find((n) => n.row == row && n.col == col)
        ?.toggleAccessibility(this.selectedAlgorithm);
      // Add your click event logic here
    }
  }
  mouseDragged(p: p5, prevMouseX: number, prevMouseY: number) {
    let row = Math.floor(p.mouseY / GridComponent.rectHeight);
    let col = Math.floor(p.mouseX / GridComponent.rectWidth);

    let prevRow = Math.floor(prevMouseY / GridComponent.rectHeight);
    let prevCol = Math.floor(prevMouseX / GridComponent.rectWidth);
    console.log(prevRow, prevCol);
    if (prevRow == row && prevCol == col) return;

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

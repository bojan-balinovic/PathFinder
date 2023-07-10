import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dijkstra } from 'src/app/models/dijkstra';
import * as p5 from 'p5';

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
  dijkstra: Dijkstra;
  path: number[];

  constructor() {}

  ngOnInit(): void {}

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
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let x = j * this.rectWidth;
        let y = i * this.rectHeight;
        if (this.path?.includes(index)) {
          p.fill(0);
        } else {
          p.fill(255);
        }
        p.stroke(0);
        p.rect(x, y, this.rectWidth, this.rectHeight);

        p.stroke(255, 0, 0);
        p.text(index++, x + 10, y + 10);
      }
    }
  }
  addEdges() {
    this.dijkstra = new Dijkstra(this.rows * this.cols);
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (j + 1 < this.cols) {
          this.dijkstra.addEdge(index, index + 1, 1);
        }
        if (j > 0) {
          this.dijkstra.addEdge(index, index - 1, 1);
        }
        if (i > 0) {
          this.dijkstra.addEdge(index, index - this.cols, 1);
        }
        if (i + 1 < this.rows) {
          this.dijkstra.addEdge(index, index + this.cols, 1);
        }
        index += 1;
      }
    }
    this.dijkstra.removeEdge(3, 4);
    this.dijkstra.removeEdge(5, 4);
    this.dijkstra.removeEdge(14, 4);
  }
  mouseClicked(p: p5) {
    let row = Math.floor(p.mouseY / this.rectHeight);
    let col = Math.floor(p.mouseX / this.rectWidth);

    if (row < this.rows && col < this.cols) {
      console.log('Clicked on rectangle at row:', row, 'column:', col);
      // Add your click event logic here
    }
  }

  findPath() {
    this.path = this.dijkstra.reconstructPath(0, 99);
    console.log(this.path);
  }
}

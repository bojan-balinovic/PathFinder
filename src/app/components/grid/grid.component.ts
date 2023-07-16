import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DijkstraAlgorithm } from 'src/app/models/dijkstra-algorithm';
import * as p5 from 'p5';
import { NodeUI } from 'src/app/models/node-ui';
import { Algorithm } from 'src/app/abstract-models/algorithm';
import { BellmanFordAlgorithm } from 'src/app/models/bellman-ford-algorithm';
import { ShortestPathService } from 'src/app/services/shortest-path.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  @ViewChild('p5Canvas', { static: true }) p5Canvas: ElementRef;
  public static rows = 20;
  public static cols = 30;
  public static rectWidth: number = 38;
  public static rectHeight: number = 48;
  private p5Instance: p5;
  private startIcon: p5.Image;
  private endIcon: p5.Image;
  private draggingStartNode: boolean;
  private draggingEndIcon: boolean;

  selectedAlgorithm: Algorithm;
  nodes: NodeUI[] = new Array<NodeUI>();

  constructor(private shortestPathService: ShortestPathService) {}

  ngOnInit(): void {
    this.selectedAlgorithm = this.shortestPathService.selectedAlgorithm;
  }

  ngAfterViewInit() {
    GridComponent.rectWidth = Math.floor(
      this.p5Canvas.nativeElement.offsetWidth / GridComponent.cols
    );
    GridComponent.rectHeight = Math.floor(
      this.p5Canvas.nativeElement.offsetHeight / GridComponent.rows
    );
    this.initNodes();
    this.createP5Sketch();
  }

  private createP5Sketch() {
    const sketch = (p: p5) => {
      this.p5Instance = p;
      let prevMouseX = p.mouseX;
      let prevMouseY = p.mouseY;

      p.preload = () => {
        this.startIcon = p.loadImage('/assets/icons/start.png');
        this.endIcon = p.loadImage('/assets/icons/end.png');
      };
      // SETUP P5 SKETCH
      p.setup = () => {
        p.createCanvas(
          this.p5Canvas.nativeElement.offsetWidth - 10,
          this.p5Canvas.nativeElement.offsetHeight - 10
        ).parent(this.p5Canvas.nativeElement);

        p.mouseClicked = () => this.mouseClicked(p);
        p.mousePressed = () => this.mousePressed(p);
        p.mouseDragged = () => this.mouseDragged(p, prevMouseX, prevMouseY);
        p.mouseReleased = () => this.mouseReleased(p);
      };

      //START DRAWING
      p.draw = () => {
        prevMouseX = p.mouseX;
        prevMouseY = p.mouseY;
        p.background(255);
        this.drawRects(p);
      };
      p.windowResized = () => {
        p.resizeCanvas(
          this.p5Canvas.nativeElement.offsetWidth - 10,
          this.p5Canvas.nativeElement.offsetHeight - 10
        );
        GridComponent.rectWidth = Math.floor(
          this.p5Canvas.nativeElement.offsetWidth / GridComponent.cols
        );
        GridComponent.rectHeight = Math.floor(
          this.p5Canvas.nativeElement.offsetHeight / GridComponent.rows
        );
        this.refreshNodesXY();
      };
    };
    this.p5Instance = new p5(sketch);
  }

  drawRects(p: p5) {
    this.nodes.forEach((node: NodeUI) => {
      if (!node.accessible) {
        // DRAW OBSTACLES
        p.fill(0, 150, 136);

        // ANIMATE OBSTACLES
        if (node.scale < 1) {
          node.scale += 0.1;
        } else {
          node.scale = 1;
        }
      } else if (this.shortestPathService.path?.includes(node.index)) {
        // DRAW SHORTEST PATH PATH
        p.fill(254, 218, 36);
      } else {
        p.fill(255);
      }
      p.push();
      // DRAW NODES
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

      // DRAW START NODE ICON
      if (node.index == this.shortestPathService.startNode) {
        p.image(
          this.startIcon,
          node.x + 5,
          node.y + 10,
          GridComponent.rectWidth - 10,
          GridComponent.rectHeight - 10
        );
      }
      // DRAW END NODE ICON
      if (node.index == this.shortestPathService.endNode) {
        p.image(
          this.endIcon,
          node.x + 5,
          node.y + 5,
          GridComponent.rectWidth - 10,
          GridComponent.rectHeight - 10
        );
      }
      // p.stroke(0, 80, 0);
      // p.text(node.index, node.x + 5, node.y + 10);
    });
  }

  initNodes() {
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
  }
  refreshNodesXY() {
    let index = 0;
    for (let i = 0; i < GridComponent.rows; i++) {
      for (let j = 0; j < GridComponent.cols; j++) {
        this.nodes[index].x = j * GridComponent.rectWidth;
        this.nodes[index].y = i * GridComponent.rectHeight;
        index += 1;
      }
    }
  }

  mouseClicked(p: p5) {}
  mousePressed(p: p5) {
    let startNode = this.nodes[this.shortestPathService.startNode];
    let endNode = this.nodes[this.shortestPathService.endNode];

    let row = Math.floor(p.mouseY / GridComponent.rectHeight);
    let col = Math.floor(p.mouseX / GridComponent.rectWidth);

    if (row < GridComponent.rows && col < GridComponent.cols) {
      this.nodes
        .find(
          (n) =>
            n.row == row &&
            n.col == col &&
            n.index != startNode.index && // DISALLOW MAKING OBSTACLES ON START NODE
            n.index != endNode.index // DISALLOW MAKING OBSTACLES ON ENDNODE
        )
        ?.toggleAccessibility(this.selectedAlgorithm);
    }

    // CHECK IF START ICON IS BEING DRAGGED
    if (
      p.mouseX >= startNode.x &&
      p.mouseX <= startNode.x + GridComponent.rectWidth &&
      p.mouseY >= startNode.y &&
      p.mouseY <= startNode.y + GridComponent.rectHeight
    ) {
      this.draggingStartNode = true;
    }

    // CHECK IF END ICON IS BEING DRAGGED
    if (
      p.mouseX >= endNode.x &&
      p.mouseX <= endNode.x + GridComponent.rectWidth &&
      p.mouseY >= endNode.y &&
      p.mouseY <= endNode.y + GridComponent.rectHeight
    ) {
      this.draggingEndIcon = true;
    }
  }

  mouseDragged(p: p5, prevMouseX: number, prevMouseY: number) {
    // MOVE START NODE (ROCKET ICON /assets/icons/start.png)
    if (this.draggingStartNode) {
      for (let n of this.nodes) {
        if (
          p.mouseX >= n.x &&
          p.mouseX <= n.x + GridComponent.rectWidth &&
          p.mouseY >= n.y &&
          p.mouseY <= n.y + GridComponent.rectHeight
        ) {
          this.shortestPathService.startNode = n.index;
          return;
        }
      }
    }
    // MOVE END NODE (STAR ICON /assets/icons/end.png)
    if (this.draggingEndIcon) {
      for (let n of this.nodes) {
        if (
          p.mouseX >= n.x &&
          p.mouseX <= n.x + GridComponent.rectWidth &&
          p.mouseY >= n.y &&
          p.mouseY <= n.y + GridComponent.rectHeight
        ) {
          this.shortestPathService.endNode = n.index;
          return;
        }
      }
    }
    // DRAW OBSTACLES
    let row = Math.floor(p.mouseY / GridComponent.rectHeight);
    let col = Math.floor(p.mouseX / GridComponent.rectWidth);

    let prevRow = Math.floor(prevMouseY / GridComponent.rectHeight);
    let prevCol = Math.floor(prevMouseX / GridComponent.rectWidth);
    console.log(prevRow, prevCol);
    if (prevRow == row && prevCol == col) return;

    if (row < GridComponent.rows && col < GridComponent.cols) {
      this.nodes
        .find((n) => n.row == row && n.col == col)
        ?.toggleAccessibility(this.selectedAlgorithm);
    }
  }
  mouseReleased(p: p5): void {
    this.draggingStartNode = false;
    this.draggingEndIcon = false;
  }
}

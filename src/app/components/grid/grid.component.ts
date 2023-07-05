import { Component, OnInit } from '@angular/core';
import { Dijkstra } from 'src/app/models/dijkstra';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let dijkstra = new Dijkstra(5);
    dijkstra.addEdge(0, 1, 6);
    dijkstra.addEdge(0, 2, 2);

    dijkstra.addEdge(1, 2, 3);
    dijkstra.addEdge(1, 3, 1);
    dijkstra.addEdge(1, 4, 5);

    dijkstra.addEdge(2, 3, 3);
    dijkstra.addEdge(2, 4, 4);

    dijkstra.addEdge(3, 4, 5);

    let path = dijkstra.reconstructPath(0, 3);
    console.log(path);
  }
}

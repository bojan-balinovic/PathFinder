import { Component, OnInit } from '@angular/core';
import { ShortestPathService } from 'src/app/services/shortest-path.service';
import { Algorithm } from 'src/app/abstract-models/algorithm';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  selectedAlgorithm: Algorithm;

  constructor(public shortestPathService: ShortestPathService) {}

  ngOnInit(): void {
    this.selectedAlgorithm = this.shortestPathService.selectedAlgorithm;
  }
  changeAlgorithm(algorithm: Algorithm) {
    this.shortestPathService.setAlgorithm(algorithm);
  }
  clearObstacles() {
    this.shortestPathService.clearObstacles.next(true);
  }
  clearPath() {
    this.shortestPathService.clearPath();
  }
}

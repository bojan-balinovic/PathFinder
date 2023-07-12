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
    this.shortestPathService.selectedAlgorithm.subscribe((sa: Algorithm) => {
      this.selectedAlgorithm = sa;
    });
  }
  changeAlgorithm(e: Event) {
    console.log(e);
    //this.shortestPathService.selectedAlgorithm.next();
  }
}

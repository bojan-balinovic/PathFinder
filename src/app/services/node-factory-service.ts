import { Injectable } from '@angular/core';
import { ShortestPathService } from './shortest-path.service';
import { NodeUI } from '../models/node-ui';
import { NodeUIData } from '../interfaces/node-ui-data';

@Injectable()
export class NodeFactoryService {
  constructor(private shortestPathService: ShortestPathService) {}
  
  getNewNode(props: NodeUIData): NodeUI {
    let node = new NodeUI(this.shortestPathService.selectedAlgorithm, props);
    return node;
  }
}

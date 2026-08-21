import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get('developer/:id')
  async getDeveloperGraph(@Param('id') id: string) {
    return this.graphService.getDeveloperGraph(id);
  }

  @Get('developer/:id/connections')
  async getDeveloperConnections(@Param('id') id: string) {
    return this.graphService.getDeveloperConnections(id);
  }

  @Get(':type/:id')
  async getGraph(
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    return this.graphService.getGraph(type, id);
  }
}
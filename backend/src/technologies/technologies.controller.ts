import { Controller, Get, Param } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';

@Controller('technologies')
export class TechnologiesController {
  constructor(
    private readonly technologiesService: TechnologiesService,
  ) {}

  @Get()
  async findAll() {
    return this.technologiesService.findAll();
  }

  @Get(':id/related')
  async findRelated(@Param('id') id: string) {
    return this.technologiesService.findRelated(id);
  }

  @Get(':id/graph')
  async findRelatedGraph(@Param('id') id: string) {
    return this.technologiesService.findRelatedGraph(id);
  }
}
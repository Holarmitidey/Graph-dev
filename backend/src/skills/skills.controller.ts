import { Controller, Get, Param } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string) {
    return this.skillsService.findRelated(id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.skillsService.findById(id);
  }
}
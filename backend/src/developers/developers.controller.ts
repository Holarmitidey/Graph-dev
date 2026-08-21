import { Controller, Get, Param } from '@nestjs/common';
import { DevelopersService } from './developers.service';

@Controller('developers')
export class DevelopersController {
  constructor(
    private readonly developersService: DevelopersService,
  ) {}

  @Get()
  async findAll() {
    return this.developersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.developersService.findById(id);
  }

  @Get(':id/technologies')
  async findTechnologies(@Param('id') id: string) {
    return this.developersService.findTechnologies(id);
  }

  @Get(':id/similar')
  async findSimilar(@Param('id') id: string) {
    return this.developersService.findSimilar(id);
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    return this.developersService.getProfile(id);
  }
}
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
}
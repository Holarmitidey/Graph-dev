import { Controller, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Get()
    async findAll() {
        return this.jobsService.findAll();
    }

    @Get(':id/matches')
        async findDeveloperMatches(@Param('id') id: string) {
        return this.jobsService.findDeveloperMatches(id);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.jobsService.findById(id);
    }

    @Get(':jobId/matches/:developerId/explain')
    async explainDeveloperMatch(
      @Param('jobId') jobId: string,
      @Param('developerId') developerId: string,
    ) {
      return this.jobsService.explainDeveloperMatch(
        jobId,
        developerId,
      );
    }

    @Get('developers/:developerId/evidence')
    async getDeveloperEvidence(
      @Param('developerId') developerId: string,
    ) {
      return this.jobsService.getDeveloperEvidence(
        developerId,
      );
    }

    @Get(':jobId/recommendations')
    async getRecommendations(
      @Param('jobId') jobId: string,
    ) {
      return this.jobsService.getRecommendations(jobId);
    }
}

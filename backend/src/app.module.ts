import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { DevelopersController } from './developers/developers.controller';
import { DevelopersService } from './developers/developers.service';
import { DevelopersModule } from './developers/developers.module';
import { JobsModule } from './jobs/jobs.module';
import { JobsController } from './jobs/jobs.controller';
import { JobsService } from './jobs/jobs.service';
import { TechnologiesModule } from './technologies/technologies.module';
import { ProjectsModule } from './projects/projects.module';
import { GraphModule } from './graph/graph.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Neo4jModule,
    DevelopersModule,
    JobsModule,
    TechnologiesModule,
    ProjectsModule,
    GraphModule,
  ],
  controllers: [AppController, DevelopersController, JobsController],
  providers: [AppService, DevelopersService, JobsService],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { DevelopersController } from './developers/developers.controller';
import { DevelopersService } from './developers/developers.service';
import { DevelopersModule } from './developers/developers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Neo4jModule,
    DevelopersModule,
  ],
  controllers: [AppController, DevelopersController],
  providers: [AppService, DevelopersService],
})
export class AppModule {}
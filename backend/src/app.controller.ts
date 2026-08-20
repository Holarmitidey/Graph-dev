import { Controller, Get } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('graph/test')
  async testGraph() {
    const records = await this.neo4jService.runQuery(`
      RETURN 'Dev-Graph connected to CognoDB!' AS message
    `);

    return {
      message: records[0].get('message'),
    };
  }

}
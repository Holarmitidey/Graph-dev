import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class TechnologiesService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll() {
    const records = await this.neo4jService.runQuery(`
      MATCH (t:Technology)

      RETURN
        t.id AS id,
        t.name AS name,
        t.category AS category

      ORDER BY t.name
    `);

    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
    }));
  }

  async findRelated(id: string) {
    const records = await this.neo4jService.runQuery(
        `
        MATCH (t:Technology {id: $id})-[:RELATED_TO]->(related:Technology)

        RETURN
        related.id AS id,
        related.name AS name,
        related.category AS category

        ORDER BY related.name
        `,
        { id },
    );

    return records.map((record) => ({
        id: record.get('id'),
        name: record.get('name'),
        category: record.get('category'),
    }));
  }

  async findRelatedGraph(id: string) {
    const records = await this.neo4jService.runQuery(
        `
        MATCH path =
        (t:Technology {id: $id})
        -[:RELATED_TO*1..2]->
        (related:Technology)

        WHERE related.id <> $id

        RETURN DISTINCT
        related.id AS id,
        related.name AS name,
        related.category AS category,
        min(length(path)) AS distance

        ORDER BY distance, related.name
        `,
        { id },
    );

    return records.map((record) => ({
        id: record.get('id'),
        name: record.get('name'),
        category: record.get('category'),
        distance: record.get('distance').toNumber(),
    }));
  }
}
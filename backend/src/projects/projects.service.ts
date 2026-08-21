import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll() {
    const records = await this.neo4jService.runQuery(`
      MATCH (p:Project)
      OPTIONAL MATCH (p)-[:USES]->(t:Technology)

      RETURN
        p.id AS id,
        p.name AS name,
        p.description AS description,
        p.type AS type,
        collect(DISTINCT t.name) AS technologies

      ORDER BY p.name
    `);

    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      description: record.get('description'),
      type: record.get('type'),
      technologies: record.get('technologies'),
    }));
  }

  async findById(id: string) {
    const records = await this.neo4jService.runQuery(
        `
        MATCH (p:Project {id: $id})

        OPTIONAL MATCH (p)-[:USES]->(t:Technology)
        OPTIONAL MATCH (d:Developer)-[:WORKED_ON]->(p)
        OPTIONAL MATCH (c:Company)-[:HAS_PROJECT]->(p)

        RETURN
        p.id AS id,
        p.name AS name,
        p.description AS description,
        p.type AS type,

        collect(DISTINCT {
            id: t.id,
            name: t.name,
            category: t.category
        }) AS technologies,

        collect(DISTINCT {
            id: d.id,
            name: d.name
        }) AS developers,

        CASE
            WHEN c IS NULL THEN null
            ELSE {
            id: c.id,
            name: c.name,
            industry: c.industry,
            location: c.location
            }
        END AS company
        `,
        { id },
    );

    if (records.length === 0) {
        return null;
    }

    const record = records[0];

    return {
        id: record.get('id'),
        name: record.get('name'),
        description: record.get('description'),
        type: record.get('type'),
        technologies: record.get('technologies').filter((t) => t.id !== null),
        developers: record.get('developers').filter((d) => d.id !== null),
        company: record.get('company'),
    };
  }
}
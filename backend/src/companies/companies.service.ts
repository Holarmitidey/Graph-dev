import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll() {
    const records = await this.neo4jService.runQuery(`
      MATCH (c:Company)

      OPTIONAL MATCH (c)-[:HAS_PROJECT]->(p:Project)
      OPTIONAL MATCH (c)-[:OFFERS]->(j:Job)

      RETURN
        c.id AS id,
        c.name AS name,
        c.industry AS industry,
        c.location AS location,
        collect(DISTINCT {
          id: p.id,
          name: p.name,
          type: p.type
        }) AS projects,
        collect(DISTINCT {
          id: j.id,
          title: j.title,
          location: j.location,
          employmentType: j.employmentType
        }) AS jobs

      ORDER BY c.name
    `);

    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      industry: record.get('industry'),
      location: record.get('location'),
      projects: record
        .get('projects')
        .filter((project) => project.id !== null),
      jobs: record
        .get('jobs')
        .filter((job) => job.id !== null),
    }));
  }

  async findById(id: string) {
    const records = await this.neo4jService.runQuery(
      `
      MATCH (c:Company {id: $id})

      OPTIONAL MATCH (c)-[:HAS_PROJECT]->(p:Project)
      OPTIONAL MATCH (c)-[:OFFERS]->(j:Job)

      RETURN
        c.id AS id,
        c.name AS name,
        c.industry AS industry,
        c.location AS location,

        collect(DISTINCT {
          id: p.id,
          name: p.name,
          type: p.type
        }) AS projects,

        collect(DISTINCT {
          id: j.id,
          title: j.title,
          location: j.location,
          employmentType: j.employmentType
        }) AS jobs
      `,
      { id },
    );

    if (records.length === 0) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    const record = records[0];

    return {
      id: record.get('id'),
      name: record.get('name'),
      industry: record.get('industry'),
      location: record.get('location'),
      projects: record
        .get('projects')
        .filter((project) => project.id !== null),
      jobs: record
        .get('jobs')
        .filter((job) => job.id !== null),
    };
  }
}
import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class DevelopersService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll() {
    const records = await this.neo4jService.runQuery(`
      MATCH (d:Developer)
      OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
      RETURN
        d.id AS id,
        d.name AS name,
        d.title AS title,
        d.bio AS bio,
        d.location AS location,
        d.experienceYears AS experienceYears,
        collect(s.name) AS skills
      ORDER BY d.name
    `);

    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      title: record.get('title'),
      bio: record.get('bio'),
      location: record.get('location'),
      experienceYears: record.get('experienceYears')?.toNumber(),
      skills: record.get('skills'),
    }));
  }

  async findById(id: string) {
    const records = await this.neo4jService.runQuery(
        `
        MATCH (d:Developer {id: $id})

        OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)

        OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)

        RETURN
        d.id AS id,
        d.name AS name,
        d.title AS title,
        d.bio AS bio,
        d.location AS location,
        d.experienceYears AS experienceYears,
        collect(DISTINCT s.name) AS skills,
        collect(DISTINCT {
            id: p.id,
            name: p.name,
            type: p.type
        }) AS projects
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
        title: record.get('title'),
        bio: record.get('bio'),
        location: record.get('location'),
        experienceYears: record.get('experienceYears')?.toNumber(),
        skills: record.get('skills'),
        projects: record.get('projects'),
    };
  }
}
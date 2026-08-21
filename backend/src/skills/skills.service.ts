import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class SkillsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll() {
    const records = await this.neo4jService.runQuery(`
      MATCH (s:Skill)

      RETURN
        s.id AS id,
        s.name AS name,
        s.category AS category

      ORDER BY s.name
    `);

    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
    }));
  }

  async findById(id: string) {
    const records = await this.neo4jService.runQuery(
      `
      MATCH (s:Skill {id: $id})

      RETURN
        s.id AS id,
        s.name AS name,
        s.category AS category
      `,
      { id },
    );

    if (records.length === 0) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    const record = records[0];

    return {
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
    };
  }

  async findRelated(id: string) {
    const records = await this.neo4jService.runQuery(
      `
      MATCH (s:Skill {id: $id})

      OPTIONAL MATCH (d:Developer)-[:HAS_SKILL]->(s)

      OPTIONAL MATCH (d)-[:HAS_SKILL]->(related:Skill)
      WHERE related.id <> s.id

      RETURN
        s.id AS skillId,
        s.name AS skillName,
        collect(DISTINCT {
          id: related.id,
          name: related.name,
          category: related.category
        }) AS relatedSkills
      `,
      { id },
    );

    if (records.length === 0) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    const record = records[0];

    return {
      skill: {
        id: record.get('skillId'),
        name: record.get('skillName'),
      },
      relatedSkills: record
        .get('relatedSkills')
        .filter((skill) => skill.id !== null),
    };
  }
}
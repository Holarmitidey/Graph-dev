import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class GraphService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getDeveloperGraph(developerId: string) {
    const records = await this.neo4jService.runQuery(
      `
      MATCH (d:Developer {id: $developerId})

      OPTIONAL MATCH (d)-[:HAS_SKILL]->(skill:Skill)

      OPTIONAL MATCH (d)-[:WORKED_ON]->(project:Project)

      OPTIONAL MATCH (project)-[:USES]->(technology:Technology)

      RETURN
        d {
          .id,
          .name,
          .title,
          .location,
          .experienceYears
        } AS developer,

        collect(DISTINCT skill {
          .id,
          .name,
          .category
        }) AS skills,

        collect(DISTINCT project {
          .id,
          .name,
          .type
        }) AS projects,

        collect(DISTINCT technology {
          .id,
          .name,
          .category
        }) AS technologies
      `,
      { developerId },
    );

    if (records.length === 0) {
      return null;
    }

    const record = records[0];

    return {
      developer: record.get('developer'),
      skills: record
        .get('skills')
        .filter((skill) => skill.id !== null),
      projects: record
        .get('projects')
        .filter((project) => project.id !== null),
      technologies: record
        .get('technologies')
        .filter((technology) => technology.id !== null),
    };
  }

  async getDeveloperConnections(developerId: string) {
    const records = await this.neo4jService.runQuery(
        `
        MATCH (d:Developer {id: $developerId})

        OPTIONAL MATCH path1 =
        (d)-[:HAS_SKILL]->(skill:Skill)

        OPTIONAL MATCH path2 =
        (d)-[:WORKED_ON]->(project:Project)
        -[:USES]->(technology:Technology)

        RETURN
        d.id AS developerId,
        d.name AS developerName,

        collect(DISTINCT {
            skill: skill.name,
            skillId: skill.id
        }) AS skills,

        collect(DISTINCT {
            project: project.name,
            projectId: project.id,
            technology: technology.name,
            technologyId: technology.id
        }) AS projectTechnologies
        `,
        { developerId },
    );

    if (records.length === 0) {
        return null;
    }

    const record = records[0];

    return {
        developer: {
        id: record.get('developerId'),
        name: record.get('developerName'),
        },

        skills: record
        .get('skills')
        .filter((item) => item.skillId !== null),

        projectTechnologies: record
        .get('projectTechnologies')
        .filter((item) => item.projectId !== null),
    };
  }

  async getGraph(type: string, id: string) {
    const labelMap = {
      developer: 'Developer',
      skill: 'Skill',
      technology: 'Technology',
      project: 'Project',
      company: 'Company',
      job: 'Job',
    };

    const label = labelMap[type.toLowerCase()];

    if (!label) {
      return null;
    }

    const records = await this.neo4jService.runQuery(
      `
      MATCH (n:${label} {id: $id})

      OPTIONAL MATCH (n)-[r]-(connected)

      RETURN
        n {
          .id,
          .name,
          .title,
          .description,
          .location,
          .type,
          .category,
          .employmentType,
          .experienceYears
        } AS node,

        collect(DISTINCT {
          id: connected.id,
          name: connected.name,
          title: connected.title,
          type: labels(connected)[0],
          relationship: type(r)
        }) AS connections
      `,
      { id },
    );

    if (records.length === 0) {
      return null;
    }

    const record = records[0];

    return {
      node: record.get('node'),
      connections: record
        .get('connections')
        .filter((connection) => connection.id !== null),
    };
  }
}
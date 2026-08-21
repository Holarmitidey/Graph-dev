import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class JobsService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async findAll() {
        const records = await this.neo4jService.runQuery(`
            MATCH (j:Job)
            OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)

            RETURN
              j.id AS id,
              j.title AS title,
              j.description AS description,
              j.location AS location,
              j.employmentType AS employmentType,
              collect(s.name) AS requiredSkills

            ORDER BY j.title
        `);

        return records.map((record) => ({
          id: record.get('id'),
          title: record.get('title'),
          description: record.get('description'),
          location: record.get('location'),
          employmentType: record.get('employmentType'),
          requiredSkills: record.get('requiredSkills'),
        }));
    }

    async findDeveloperMatches(jobId: string) {
        const records = await this.neo4jService.runQuery(
            `
            MATCH (j:Job {id: $jobId})-[:REQUIRES]->(required:Skill)
            WITH j, collect(required) AS requiredSkills

            MATCH (d:Developer)-[:HAS_SKILL]->(skill:Skill)

            WITH
                j,
                requiredSkills,
                d,
                collect(skill) AS developerSkills

            WITH
                j,
                requiredSkills,
                d,
                developerSkills,

                [skill IN developerSkills
                    WHERE skill IN requiredSkills] AS matchedSkills,

                [skill IN requiredSkills
                    WHERE NOT skill IN developerSkills] AS missingSkills

            OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)
            OPTIONAL MATCH (p)-[:USES]->(t:Technology)

            WITH
                requiredSkills,
                d,
                matchedSkills,
                missingSkills,

                collect(DISTINCT {
                    id: p.id,
                    name: p.name,
                    type: p.type
                }) AS projects,

                collect(DISTINCT t.name) AS technologyNames

            WITH
                d,
                requiredSkills,
                matchedSkills,
                missingSkills,
                projects,
                technologyNames,

                [skill IN requiredSkills
                    WHERE skill.name IN technologyNames] AS projectMatchedSkills

            WITH
                d,
                requiredSkills,
                matchedSkills,
                missingSkills,
                projects,
                technologyNames,
                projectMatchedSkills,

                toFloat(size(matchedSkills))
                    / size(requiredSkills) * 80
                    AS skillScore

            WITH
                d,
                matchedSkills,
                missingSkills,
                projects,
                technologyNames,
                projectMatchedSkills,
                skillScore,

                CASE
                    WHEN size(projectMatchedSkills) > 0
                    THEN 20
                    ELSE 0
                END AS projectScore

            RETURN
                d.id AS id,
                d.name AS name,
                d.title AS title,
                d.location AS location,
                d.experienceYears AS experienceYears,

                [skill IN matchedSkills | skill.name]
                    AS matchedSkills,

                [skill IN missingSkills | skill.name]
                    AS missingSkills,

                [skill IN projectMatchedSkills | skill.name]
                    AS projectMatchedSkills,

                projects,

                technologyNames AS technologies,

                skillScore + projectScore AS matchScore

            ORDER BY matchScore DESC, experienceYears DESC
            `,
            { jobId },
        );

        return records.map((record) => ({
            developer: {
                id: record.get('id'),
                name: record.get('name'),
                title: record.get('title'),
                location: record.get('location'),
                experienceYears: record.get('experienceYears')?.toNumber(),
            },

            matchScore: record.get('matchScore'),

            matchedSkills: record.get('matchedSkills'),

            missingSkills: record.get('missingSkills'),

            projectMatchedSkills: record.get('projectMatchedSkills'),

            relevantProjects: record
                .get('projects')
                .filter((project) => project.id !== null),

            technologies: record.get('technologies'),
        }));
    }

    async findById(id: string) {
        const records = await this.neo4jService.runQuery(
            `
            MATCH (j:Job {id: $id})
            OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)

            RETURN
            j.id AS id,
            j.title AS title,
            j.description AS description,
            j.location AS location,
            j.employmentType AS employmentType,
            collect(s.name) AS requiredSkills
            `,
            { id },
        );

        if (records.length === 0) {
            throw new NotFoundException(`Job with ID ${id} not found`);
        }

        const record = records[0];

        return {
            id: record.get('id'),
            title: record.get('title'),
            description: record.get('description'),
            location: record.get('location'),
            employmentType: record.get('employmentType'),
            requiredSkills: record.get('requiredSkills'),
        };
    }

    async explainDeveloperMatch(jobId: string, developerId: string) {
        const records = await this.neo4jService.runQuery(
            `
            MATCH (j:Job {id: $jobId})
            MATCH (d:Developer {id: $developerId})

            OPTIONAL MATCH (j)-[:REQUIRES]->(required:Skill)

            OPTIONAL MATCH (d)-[:HAS_SKILL]->(developerSkill:Skill)

            OPTIONAL MATCH (d)-[:WORKED_ON]->(project:Project)

            OPTIONAL MATCH (project)-[:USES]->(technology:Technology)

            WITH
            j,
            d,
            collect(DISTINCT required) AS requiredSkills,
            collect(DISTINCT developerSkill) AS developerSkills,
            collect(DISTINCT project) AS projects,
            collect(DISTINCT technology) AS technologies

            WITH
            j,
            d,
            requiredSkills,
            developerSkills,
            projects,
            technologies,

            [skill IN requiredSkills
                WHERE skill IN developerSkills] AS matchedSkills,

            [skill IN requiredSkills
                WHERE NOT skill IN developerSkills] AS missingSkills

            RETURN
            d.id AS id,
            d.name AS name,
            d.title AS title,
            d.location AS location,
            d.experienceYears AS experienceYears,

            [skill IN matchedSkills | skill.name]
                AS matchedSkills,

            [skill IN missingSkills | skill.name]
                AS missingSkills,

            [project IN projects |
                {
                id: project.id,
                name: project.name,
                type: project.type
                }
            ] AS projects,

            [technology IN technologies |
                {
                id: technology.id,
                name: technology.name,
                category: technology.category
                }
            ] AS technologies
            `,
            {
            jobId,
            developerId,
            },
        );

        if (records.length === 0) {
            return null;
        }

        const record = records[0];

        const matchedSkills = record.get('matchedSkills');
        const missingSkills = record.get('missingSkills');

        const totalSkills =
            matchedSkills.length + missingSkills.length;

        const matchScore =
            totalSkills === 0
            ? 0
            : Math.round(
                (matchedSkills.length / totalSkills) * 100,
                );

        return {
            developer: {
            id: record.get('id'),
            name: record.get('name'),
            title: record.get('title'),
            location: record.get('location'),
            experienceYears: record
                .get('experienceYears')
                ?.toNumber(),
            },

            matchScore,

            matchedSkills,

            missingSkills,

            projects: record
            .get('projects')
            .filter((project) => project.id !== null),

            technologies: record
            .get('technologies')
            .filter((technology) => technology.id !== null),
        };
    }

    async getDeveloperEvidence(developerId: string) {
        const records = await this.neo4jService.runQuery(
            `
            MATCH (d:Developer {id: $developerId})
            MATCH path =
            (d)-[:HAS_SKILL]->(s:Skill)
            -[:REPRESENTS]->(t:Technology)
            <-[:USES]-(p:Project)

            RETURN
            s.name AS skill,
            t.name AS technology,
            p.id AS projectId,
            p.name AS projectName,
            p.type AS projectType
            `,
            {
            developerId,
            },
        );

        return records.map((record) => ({
            skill: record.get('skill'),
            technology: record.get('technology'),
            project: {
            id: record.get('projectId'),
            name: record.get('projectName'),
            type: record.get('projectType'),
            },
        }));
    }

    async getRecommendations(jobId: string) {
        const records = await this.neo4jService.runQuery(
            `
            MATCH (j:Job {id: $jobId})
            MATCH (d:Developer)

            OPTIONAL MATCH (j)-[:REQUIRES]->(required:Skill)
            OPTIONAL MATCH (d)-[:HAS_SKILL]->(developerSkill:Skill)

            WITH
            j,
            d,
            collect(DISTINCT required) AS requiredSkills,
            collect(DISTINCT developerSkill) AS developerSkills

            WITH
            j,
            d,
            requiredSkills,
            developerSkills,

            [skill IN requiredSkills
                WHERE skill IN developerSkills] AS matchedSkills,

            [skill IN requiredSkills
                WHERE NOT skill IN developerSkills] AS missingSkills

            WHERE size(matchedSkills) > 0

            OPTIONAL MATCH (d)-[:WORKED_ON]->(project:Project)

            WITH
            j,
            d,
            requiredSkills,
            matchedSkills,
            missingSkills,
            collect(DISTINCT project) AS projects

            OPTIONAL MATCH (d)-[:HAS_SKILL]->(skill:Skill)
            OPTIONAL MATCH (skill)-[:REPRESENTS]->(technology:Technology)

            WITH
            j,
            d,
            requiredSkills,
            matchedSkills,
            missingSkills,
            projects,
            collect(DISTINCT technology) AS technologies

            WITH
            d,
            requiredSkills,
            matchedSkills,
            missingSkills,
            projects,
            technologies,

            toFloat(size(matchedSkills))
                / size(requiredSkills) * 100
                AS skillScore

            WITH
            d,
            matchedSkills,
            missingSkills,
            projects,
            technologies,
            skillScore,

            CASE
                WHEN d.experienceYears >= 5 THEN 100
                WHEN d.experienceYears >= 3 THEN 80
                WHEN d.experienceYears >= 1 THEN 60
                ELSE 40
            END AS experienceScore

            WITH
            d,
            matchedSkills,
            missingSkills,
            projects,
            technologies,
            skillScore,
            experienceScore,

            CASE
                WHEN size(projects) >= 2 THEN 100
                WHEN size(projects) = 1 THEN 70
                ELSE 0
            END AS projectScore

            WITH
            d,
            matchedSkills,
            missingSkills,
            projects,
            technologies,
            skillScore,
            experienceScore,
            projectScore,

            CASE
                WHEN size(technologies) >= 3 THEN 100
                WHEN size(technologies) = 2 THEN 80
                WHEN size(technologies) = 1 THEN 60
                ELSE 0
            END AS technologyScore

            WITH
            d,
            matchedSkills,
            missingSkills,
            projects,
            technologies,
            skillScore,
            experienceScore,
            projectScore,
            technologyScore,

            (
                skillScore * 0.60 +
                experienceScore * 0.15 +
                projectScore * 0.15 +
                technologyScore * 0.10
            ) AS matchScore

            RETURN
            d.id AS id,
            d.name AS name,
            d.title AS title,
            d.location AS location,
            d.experienceYears AS experienceYears,

            [skill IN matchedSkills | skill.name]
                AS matchedSkills,

            [skill IN missingSkills | skill.name]
                AS missingSkills,

            [project IN projects |
                {
                id: project.id,
                name: project.name,
                type: project.type
                }
            ] AS projects,

            [technology IN technologies |
                {
                id: technology.id,
                name: technology.name,
                category: technology.category
                }
            ] AS technologies,

            round(skillScore) AS skillScore,
            round(experienceScore) AS experienceScore,
            round(projectScore) AS projectScore,
            round(technologyScore) AS technologyScore,
            round(matchScore) AS matchScore

            ORDER BY matchScore DESC, experienceYears DESC
            `,
            { jobId },
        );

        return records.map((record, index) => ({
            rank: index + 1,

            developer: {
                id: record.get('id'),
                name: record.get('name'),
                title: record.get('title'),
                location: record.get('location'),
                experienceYears: record
                .get('experienceYears')
                ?.toNumber(),
            },

            matchScore: record.get('matchScore'),

            scoreBreakdown: {
                skills: record.get('skillScore'),
                experience: record.get('experienceScore'),
                projects: record.get('projectScore'),
                technologies: record.get('technologyScore'),
            },

            matchedSkills: record.get('matchedSkills'),

            missingSkills: record.get('missingSkills'),

            projects: record
                .get('projects')
                .filter((project) => project.id !== null),

            technologies: record
                .get('technologies')
                .filter((technology) => technology.id !== null),
        }));
    }
}

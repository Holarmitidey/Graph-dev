import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
    private readonly driver: Driver;

    constructor() {
        this.driver = neo4j.driver(
            process.env.COGNODB_URI!,
            neo4j.auth.basic(
                process.env.COGNODB_USERNAME!,
                process.env.COGNODB_PASSWORD!
            ),
        );
    }

    async onModuleInit() {
        await this.driver.verifyConnectivity();
        console.log('Connected to Neo4j');
    }

    async onModuleDestroy() {
        await this.driver.close();
    }

    getDriver(): Driver {
        return this.driver;
    }

    async runQuery<T = unknown>(query: string, params: Record<string, unknown> = {}) {
        const session = this.driver.session();

        try {
            const result = await session.run(query, params);
            return result.records;
        } finally {
            await session.close();
        }
    }
}
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import databaseConfig from '@_config/database.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(
        @Inject(databaseConfig.KEY)
        private dbConfig: ConfigType<typeof databaseConfig>,
    ) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.dbConfig.host,
            port: +this.dbConfig.port,
            username: this.dbConfig.username,
            password: this.dbConfig.password,
            database: this.dbConfig.database,
            autoLoadEntities: true,
            synchronize: this.dbConfig.synchronize,
            logging: this.dbConfig.logging,
        };
    }
}

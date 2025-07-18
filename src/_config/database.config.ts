import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 54325,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'postgres_test',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    poolSize: process.env.DATABASE_POOL_SIZE || 10,
}));

import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
                PORT: Joi.number().required(),
                MYSQL_HOST: Joi.string().required(),
                MYSQL_PORT: Joi.number().required(),
                MYSQL_USERNAME: Joi.string().required(),
                MYSQL_PASSWORD: Joi.string().required(),
                MYSQL_DATABASE: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXP: Joi.string().required(),
            }),
            cache: true,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: +process.env.MYSQL_PORT,
                username: process.env.MYSQL_USERNAME,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false,
                logging: process.env.LOGGING === 'true',
                autoLoadEntities: true,
                timezone: '+09:00',
            }),
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

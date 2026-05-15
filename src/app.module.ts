/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration, { AppConfig } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from '@modules/users/users.module';
import { LoansModule } from '@modules/loans/loans.module';
import { ItemsModule } from '@modules/items/items.module';
import { AuthModule } from '@modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard/roles.guard.guard';


@Module({
  imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema,
            validationOptions: {
				abortEarly: false,
            },
        }),
        TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<AppConfig>): TypeOrmModuleOptions => {
				const database = config.get('database', { infer: true })!;
				return {
					type: 'postgres',
					host: database.host,
					port: database.port,
					username: database.user,
					password: database.password,
					database: database.name,
					autoLoadEntities: true,
					synchronize: database.synchronize,
					logging: database.logging,
					entities: [__dirname + '/**/*.entity{.ts,.js}'],
          			migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
				};
			},
        }),
        HealthModule,
        UsersModule,
        LoansModule,
        ItemsModule,
        AuthModule,
    ],
    providers: [
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard },
	],

})
export class AppModule {}

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

require('dotenv').config();

class ConfigService {
  constructor(
    private logger: Logger,
    private env: { [k: string]: string | undefined }
  ) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (requiredVars.includes(key) && !value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getNatsConfig() {
    return {
      natsUrl: 'https://' + this.getValue('NATS_HOST') + ':' + this.getValue('NATS_PORT'),
    }
  }

  public getSendGridApiKey() {
    return this.getValue('SENDGRID_API_KEY');
  }

  public getDefaultDbConfig(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',

      host: this.getValue('DATABASE_HOST'),
      port: parseInt(this.getValue('DATABASE_PORT')),
      username: this.getValue('DATABASE_USER'),
      password: this.getValue('DATABASE_PASS'),
      database: this.getValue('DATABASE_NAME'),

      entities: ['dist/**/*.entity{.ts,.js}'],

      poolErrorHandler: function(err: any) {
        this.logger.warn(err);
      },

      // logging: ['query', 'error'],
      logging: ['error'],

      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },

      synchronize: false,
      cache: true,
      ssl: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod',
    };
  }

  public getReadOnlyDbConfig(): TypeOrmModuleOptions {
    return {
      name: 'readonly',
      type: 'postgres',

      host: this.getValue('READONLY_DATABASE_HOST'),
      port: parseInt(this.getValue('READONLY_DATABASE_PORT')),
      username: this.getValue('READONLY_DATABASE_USER'),
      password: this.getValue('READONLY_DATABASE_PASS'),
      database: this.getValue('READONLY_DATABASE_NAME'),

      entities: ['dist/**/*.entity{.ts,.js}'],

      poolErrorHandler: function(err: any) {
        this.logger.error(err);
      },

      logging: ['error'],

      synchronize: false,
      cache: false,
      ssl: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod' ? { rejectUnauthorized: false } : false,
    };
  }

}

const requiredVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_NAME',
  'NATS_HOST',
  'NATS_PORT',
  'READONLY_DATABASE_HOST',
  'READONLY_DATABASE_PORT',
  'READONLY_DATABASE_USER',
  'READONLY_DATABASE_NAME',
];

const logger = new Logger('ConfigService');
const configService = new ConfigService(logger, process.env)
  .ensureValues(requiredVars);

export { configService };
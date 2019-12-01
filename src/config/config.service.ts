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

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
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

      logging: ['query', 'error'],
      synchronize: false,
      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: true,
    };
  }

}

const requiredVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_NAME',
  'NATS_HOST',
  'NATS_PORT'
];

const logger = new Logger('ConfigService');
const configService = new ConfigService(logger, process.env)
  .ensureValues(requiredVars);

export { configService };
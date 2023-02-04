import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const defaultDatabaseUrl =
  'postgres://{username}:{password}@localhost:5432/{database_name}';

const databaseUrl = process.env.DATABASE_URL || defaultDatabaseUrl;

export { isProduction, isDevelopment, isTest, databaseUrl };

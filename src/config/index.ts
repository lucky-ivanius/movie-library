import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const defaultDatabaseUrl =
  'postgres://{useername}:{password}@localhost:5432/{database_name}';

const databaseUrl = isProduction
  ? (process.env.DATABASE_URL_PROD as string)
  : isDevelopment
  ? (process.env.DATABASE_URL_DEV as string)
  : isTest
  ? (process.env.DATABASE_URL_TEST as string)
  : defaultDatabaseUrl;

export { isProduction, isDevelopment, isTest, databaseUrl };

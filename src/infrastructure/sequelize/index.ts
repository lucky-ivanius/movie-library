import { Sequelize } from 'sequelize';
import { databaseUrl, isDevelopment } from '../../config';

const sequelize = new Sequelize(databaseUrl, {
  logging: isDevelopment
});

function connectDb() {
  sequelize.authenticate().catch((err) => {
    console.error(err);
  });
}

function syncDb() {
  sequelize.sync().catch((err) => {
    console.error(err);
  });
}

function closeDb() {
  sequelize.close().catch((err) => {
    console.error(err);
  });
}

export { connectDb, syncDb, closeDb, sequelize };

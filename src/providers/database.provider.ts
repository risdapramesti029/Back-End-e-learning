import { Sequelize } from 'sequelize-typescript';
import { AuthModel } from 'src/models/auth.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOSTNAME,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
      sequelize.addModels([AuthModel]);
      await sequelize.sync({
        alter: process.env.APP_MODE == 'production' ? false : true,
      });

      return sequelize;
    },
  },
];

import { Sequelize } from 'sequelize-typescript';
import { AuthModel } from 'src/models/auth.entity';
import { PembayaranModel } from 'src/models/buktipembayaran.entity';
import { MapelModel } from 'src/models/mapel.entity';
import { MateriModel } from 'src/models/materi.entity';
import { SoalModel } from 'src/models/soal.entity';

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
      sequelize.addModels([
        AuthModel,
        MapelModel,
        MateriModel,
        SoalModel,
        PembayaranModel,
      ]);
      await sequelize.sync({
        // alter: true,
        // force: true,
        alter: process.env.APP_MODE == 'production' ? false : true,
      });

      return sequelize;
    },
  },
];

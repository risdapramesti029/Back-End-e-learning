import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/services/app.service';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from 'src/controller/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { authProviders } from 'src/providers/auth.provider';
import { ResponseHelper } from 'src/helpers/response.helpers';
import { MapelController } from 'src/controller/mapel.controller';
import { materiProviders } from 'src/providers/materi.provider';
import { MateriController } from 'src/controller/materi.controller';
import { MateriService } from 'src/services/materi.service';
import { pembayaranProviders } from 'src/providers/buktipembayaran.provider';
import { BuktiPembayaranService } from 'src/services/buktipembayaran.service';
import { BuktiPembayaranController } from 'src/controller/buktipembayaran.controller';
import { soalProviders } from 'src/providers/soal.provider';
import { SoalController } from 'src/controller/soal.controller';
import { SoalService } from 'src/services/soal.service';
import { MapelService } from 'src/services/mapel.service';
import { mapelProviders } from 'src/providers/mapel.providers';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/static',
    }),

    DatabaseModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'lvj3lkas82r17kj',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    MapelController,
    MateriController,
    BuktiPembayaranController,
    SoalController,
  ],
  providers: [
    AppService,
    AuthService,
    ...authProviders,
    MapelService,
    ...mapelProviders,
    MateriService,
    ...materiProviders,
    ResponseHelper,
    BuktiPembayaranService,
    ...pembayaranProviders,
    SoalService,
    ...soalProviders,
  ],
})
export class AppModule {}

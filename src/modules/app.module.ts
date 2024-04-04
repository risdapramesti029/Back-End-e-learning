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

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'lvj3lkas82r17kj',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, ...authProviders, ResponseHelper],
})
export class AppModule {}

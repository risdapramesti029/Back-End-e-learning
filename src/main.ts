import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
const express = require('express');
const fs = require('fs-extra'); // Import fs-extra

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();

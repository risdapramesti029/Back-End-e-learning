import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMateriDTO, updateMateriDTO } from 'src/dto/materi.dto';
import { ResponseHelper } from 'src/helpers/response.helpers';
import { MateriService } from 'src/services/materi.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('materi')
export class MateriController {
  constructor(
    private readonly materiService: MateriService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Get('/list')
  async getAllMateri(@Res() res: Response) {
    try {
      const data: any = await this.materiService.getAllMateri();
      const materiWithUrls = data.map((materi) => ({
        ...materi,
        file_url: `http://localhost:3000/static/${materi.file}`,
      }));

      return this.responseHelper.responseSuccessData(
        res,
        200,
        'Berhasil Mendapatkan data materi',
        materiWithUrls,
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createMateri(
    @UploadedFile() file,
    @Res() res: Response,
    @Body(new ValidationPipe()) body: createMateriDTO,
  ) {
    try {
      if (!file || !file.buffer) {
        return this.responseHelper.responseClientError(
          res,
          400,
          'File tidak disediakan atau tidak valid',
        );
      }

      const filePath = `public/${file.originalname}`;
      fs.writeFileSync(filePath, file.buffer);

      const materiData = {
        id_mapel: body.id_mapel,
        materi: body.materi,
        file: file.originalname,
        created_by: body.created_by,
      };
      const data = await this.materiService.createMateri(materiData);

      return this.responseHelper.responseSuccessData(
        res,
        201,
        'Materi berhasil dibuat',
        data,
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields.materi) {
          return this.responseHelper.responseClientError(
            res,
            400,
            'Materi sudah terdaftar',
          );
        }
      }
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Get('/:id')
  async getMateriById(@Res() res, @Param('id') id) {
    try {
      const data: any = await this.materiService.getMateriById(id);

      if (!data) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `Materi dengan ${id} tidak ditemukan`,
        );
      }

      const file_url = `http://localhost:3000/static/${data.file}`;

      return this.responseHelper.responseSuccessData(
        res,
        200,
        'Berhasil Mendapatkan data materi',
        { data, file_url },
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateMateri(
    @Res() res,
    @Param('id') id,
    @Body(new ValidationPipe()) body: updateMateriDTO,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const materi = await this.materiService.getMateriById(id);
      if (!materi) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `Materi dengan ${id} tidak ditemukan`,
        );
      }

      let filePath = `public/${materi.file}`;

      if (file && file.buffer) {
        fs.unlinkSync(filePath);
        filePath = `public/${file.originalname}`;
        fs.writeFileSync(filePath, file.buffer);
      }

      if (!file) {
        const materiData = {
          id_mapel: body.id_mapel,
          materi: body.materi,
          updated_by: body.updated_by,
        };
        await this.materiService.updateMateri(id, materiData);
        return this.responseHelper.responseSuccess(
          res,
          200,
          'Materi berhasil diupdate',
        );
      } else {
        const materiData = {
          id_mapel: body.id_mapel,
          materi: body.materi,
          file: file.originalname,
          updated_by: body.updated_by,
        };
        await this.materiService.updateMateri(id, materiData);
        return this.responseHelper.responseSuccess(
          res,
          200,
          'Materi berhasil diupdate',
        );
      }
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Delete('/:id')
  async deleteMateri(@Res() res, @Param('id') id) {
    try {
      const materi = await this.materiService.getMateriById(id);
      if (!materi) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `Materi dengan ${id} tidak ditemukan`,
        );
      }
      let filePath = `public/${materi.file}`;
      fs.unlinkSync(filePath);
      const data = await this.materiService.deleteMateri(id);

      return this.responseHelper.responseSuccess(
        res,
        200,
        'Materi berhasil dihapus',
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }
}

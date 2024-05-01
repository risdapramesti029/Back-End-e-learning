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
import {
  createdPembayaranDTO,
  updatePembayaranDTO,
} from 'src/dto/pembayaran.dto';
import { ResponseHelper } from 'src/helpers/response.helpers';
import { BuktiPembayaranService } from 'src/services/buktipembayaran.service';
import * as fs from 'fs';

@Controller('pembayaran')
export class BuktiPembayaranController {
  constructor(
    private readonly buktiPembayaranService: BuktiPembayaranService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Get('/list')
  async getAllPembayaran(@Res() res: Response) {
    try {
      const data: any = await this.buktiPembayaranService.getAllPembayaran();
      const materiWithUrls = data.map((pembayaran) => ({
        pembayaran,
        file_url: `http://localhost:3000/static/${pembayaran.file}`,
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
  async createPembayaran(
    @UploadedFile() file,
    @Res() res: Response,
    @Body(new ValidationPipe()) pembayaran: createdPembayaranDTO,
  ) {
    try {
      const filePath = `public/${file.originalname}`;
      fs.writeFileSync(filePath, file.buffer);

      const pembayaranData = {
        id_user: pembayaran.id_user,
        file: file.originalname,
        created_by: pembayaran.created_by,
      };
      const createdPembayaran =
        await this.buktiPembayaranService.createPembayaran(pembayaranData);
      return this.responseHelper.responseSuccessData(
        res,
        201,
        'Pembayaran Berhasil dibuat',
        createdPembayaran,
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields.materi) {
          return this.responseHelper.responseClientError(
            res,
            400,
            'Pembayaran sudah terdaftar',
          );
        }
      }
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Get('/:id')
  async getPembayaranById(@Res() res, @Param('id') id) {
    try {
      const pembayaran =
        await this.buktiPembayaranService.getPembayaranById(id);
      const file_url = `http://localhost:3000/static/${pembayaran.file}`;

      if (!pembayaran) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `Pembayaran dengan ${id} tidak ditemukan`,
        );
      }
      return this.responseHelper.responseSuccessData(
        res,
        200,
        'Berhasil mendapatkan data pembayaran',
        { pembayaran, file_url },
      );
    } catch (error) {
      return error;
    }
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePembayaran(
    @Res() res,
    @Param('id') id,
    @Body(new ValidationPipe()) body: updatePembayaranDTO,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const pembayaran =
        await this.buktiPembayaranService.getPembayaranById(id);
      if (!pembayaran) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `pembayaran dengan ${id} tidak ditemukan`,
        );
      }

      let filePath = `public/${pembayaran.file}`;

      if (file && file.buffer) {
        fs.unlinkSync(filePath);
        filePath = `public/${file.originalname}`;
        fs.writeFileSync(filePath, file.buffer);
      }

      if (!file) {
        const pembayaranData = {
          id_user: body.id_user,
          status: body.status,
          updated_by: body.updated_by,
        };
        await this.buktiPembayaranService.updatePembayaran(id, pembayaranData);
        return this.responseHelper.responseSuccess(
          res,
          200,
          'pembayaran berhasil diupdate',
        );
      } else {
        const pembayaranData = {
          id_user: body.id_user,
          status: body.status,
          file: file.originalname,
          updated_by: body.updated_by,
        };
        await this.buktiPembayaranService.updatePembayaran(id, pembayaranData);
        return this.responseHelper.responseSuccess(
          res,
          200,
          'pembayaran berhasil diupdate',
        );
      }
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Delete('/:id')
  async deletePembayaran(@Res() res, @Param('id') id) {
    try {
      const pembayaran =
        await this.buktiPembayaranService.getPembayaranById(id);
      if (!pembayaran) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `pembayaran dengan ${id} tidak ditemukan`,
        );
      }
      let filePath = `public/${pembayaran.file}`;
      fs.unlinkSync(filePath);
      const data = await this.buktiPembayaranService.deletePembayaran(id);

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

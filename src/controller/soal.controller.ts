import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { createMateriDTO } from 'src/dto/materi.dto';
import { createSoalDTO, updateSoalDTO } from 'src/dto/soal.dto';
import { ResponseHelper } from 'src/helpers/response.helpers';
import { SoalService } from 'src/services/soal.service';

@Controller('soal')
export class SoalController {
  constructor(
    private readonly soalService: SoalService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Get('/list')
  async getAllSoal(@Res() res) {
    try {
      const data = await this.soalService.getAllSoal();
      return this.responseHelper.responseSuccessData(
        res,
        200,
        'Berhasil Mendapatkan data Soal',
        data,
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Get('/:id')
  async getSoalById(@Res() res, @Param('id') id) {
    try {
      const data = await this.soalService.getSoalById(id);
      if (!data) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `Soal dengan ${id} tidak ditemukan`,
        );
      }
      return this.responseHelper.responseSuccessData(
        res,
        200,
        'Berhasil Mendapatkan data Soal',
        data,
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Post()
  async createSoal(@Res() res, @Body() body: createSoalDTO) {
    try {
      const data = await this.soalService.createSoal(body);
      return this.responseHelper.responseSuccessData(
        res,
        201,
        'Soal berhasil dibuat',
        data,
      );
    } catch (error) {
      if (error.fields.soal) {
        return this.responseHelper.responseClientError(
          res,
          400,
          'Soal sudah ada',
        );
      }
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Put('/:id')
  async updateSoal(@Res() res, @Body() body: updateSoalDTO, @Param('id') id) {
    try {
      const soal = await this.soalService.getSoalById(id);
      if (!soal) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `Soal dengan ${id} tidak ditemukan`,
        );
      }
      await this.soalService.updateSoal(id, body);
      return this.responseHelper.responseSuccess(
        res,
        200,
        'Soal berhasil diupdate',
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Delete('/:id')
  async deleteSoal(@Res() res, @Param('id') id) {
    try {
      const soal = await this.soalService.getSoalById(id);
      if (!soal) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `Soal dengan ${id} tidak ditemukan`,
        );
      }
      await this.soalService.deleteSoal(id);
      return this.responseHelper.responseSuccess(
        res,
        200,
        'Soal berhasil dihapus',
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }
}

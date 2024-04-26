import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { createMapelDTO, updateMapelDTO } from 'src/dto/mapel.dto';
import { ResponseHelper } from 'src/helpers/response.helpers';
import { MapelService } from 'src/services/mapel.service';

@Controller('mapel')
export class MapelController {
  constructor(
    private readonly mapelservice: MapelService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Get('/list')
  async getAllMapel(@Res() res) {
    try {
      const mapel = await this.mapelservice.getAllMapel();
      return this.responseHelper.responseSuccessData(
        res,
        200,
        'Berhasil Mendapatkan data mapel',
        mapel,
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(error);
    }
  }

  @Get('/:id')
  async getMapelById(@Res() res, @Param('id') id) {
    try {
      const mapel = await this.mapelservice.getMapelById(id);
      if (!mapel) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `mapel dengan ${id} tidak ditemukan`,
        );
      }
      const materi = await this.mapelservice.getMateri(id);
      const soal = await this.mapelservice.getSoal(materi);
      return this.responseHelper.responseSuccessData(
        res,
        201,
        `Berhasil Mendapatkan mapel dengan id ${id}`,
        { mapel, materi, soal },
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Post()
  async createMapel(@Body() mapel: createMapelDTO, @Res() res) {
    try {
      const newmapel = await this.mapelservice.createMapel(mapel);

      return this.responseHelper.responseSuccessData(
        res,
        201,
        'mapel berhasil dibuat',
        newmapel,
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: 'Gagal membuat mapel',
        error: error.message,
      });
    }
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  async updateMapel(
    @Res() res,
    @Body() body: updateMapelDTO,
    @Param('id') id: number,
  ) {
    try {
      const mapel = await this.mapelservice.getMapelById(id);
      if (!mapel) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `mapel dengan id ${id} tidak ditemukan`,
        );
      }
      await this.mapelservice.updateMapel(id, body);
      return this.responseHelper.responseSuccessData(
        res,
        200,
        'mapel berhasil diupdate',
        mapel,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(error);
    }
  }

  @Delete('/:id')
  async deleteMapel(@Res() res, @Param('id') id: number) {
    try {
      const mapel = await this.mapelservice.getMapelById(id);
      if (!mapel) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `mapel dengan id ${id} tidak ditemukan`,
        );
      }
      await this.mapelservice.deleteMapel(id);
      return this.responseHelper.responseSuccess(
        res,
        200,
        'mapel berhasil dihapus',
      );
    } catch (error) {
      return this.responseHelper.responseServerError(error);
    }
  }
}

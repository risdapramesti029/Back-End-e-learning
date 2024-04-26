import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { updateMapelDTO } from 'src/dto/mapel.dto';
import { MapelModel } from 'src/models/mapel.entity';
import { MateriModel } from 'src/models/materi.entity';
import { SoalModel } from 'src/models/soal.entity';

@Injectable()
export class MapelService {
  constructor(
    @Inject('MAPEL_REPOSITORY')
    private readonly mapelRepository: typeof MapelModel,
    @Inject('MATERI_REPOSITORY')
    private readonly materiRepository: typeof MateriModel,
    @Inject('SOAL_REPOSITORY')
    private readonly soalRepository: typeof SoalModel,
  ) {}

  async getAllMapel() {
    try {
      const mapel = await this.mapelRepository.sequelize.query(
        `SELECT * FROM e_mapel`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );
      return mapel;
    } catch (error) {
      throw error;
    }
  }

  async getMapelById(id): Promise<MapelModel> {
    try {
      const mapel = await this.mapelRepository.findOne({
        where: { id_mapel: id },
      });
      return mapel;
    } catch (error) {
      throw error;
    }
  }
  async getMateri(id) {
    try {
      const materi = await this.materiRepository.sequelize.query(
        `select id_materi, materi from e_materi where id_mapel = ${id}`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );

      return materi;
    } catch (error) {
      throw error;
    }
  }

  async getSoal(materi) {
    const id = materi[0].id_materi;
    try {
      const materi = await this.soalRepository.sequelize.query(
        `select id_soal, soal from e_soal where id_materi = ${id}`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );

      return materi;
    } catch (error) {
      throw error;
    }
  }

  async createMapel(mapel: any): Promise<MapelModel> {
    try {
      const createdmapel = await this.mapelRepository.create(mapel);
      return createdmapel;
    } catch (error) {
      throw error;
    }
  }

  updateMapel(
    id: number,
    body: updateMapelDTO,
  ): Promise<[affectedCount: number]> {
    return this.mapelRepository.update<MapelModel>(body, {
      where: { id_mapel: id },
    });
  }

  deleteMapel(id: number): Promise<number> {
    return this.mapelRepository.destroy({
      where: { id_mapel: id },
    });
  }
}

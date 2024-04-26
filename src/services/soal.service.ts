import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { createSoalDTO } from 'src/dto/soal.dto';
import { SoalModel } from 'src/models/soal.entity';

@Injectable()
export class SoalService {
  constructor(
    @Inject('SOAL_REPOSITORY')
    private readonly soalRepository: typeof SoalModel,
  ) {}

  async getAllSoal() {
    try {
      const soal = await this.soalRepository.sequelize.query(
        `SELECT * FROM e_soal`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );

      return soal;
    } catch (error) {
      throw error;
    }
  }

  async getSoalById(id: number) {
    try {
      const soal = await this.soalRepository.findOne({
        where: { id_soal: id },
      });
      return soal;
    } catch (error) {
      throw error;
    }
  }

  async createSoal(soal: any) {
    try {
      const createdSoal = await this.soalRepository.create(soal);
      return createdSoal;
    } catch (error) {
      throw error;
    }
  }

  async updateSoal(id: number, body: any) {
    try {
      const updatedSoal = await this.soalRepository.update(body, {
        where: { id_soal: id },
      });
      return updatedSoal;
    } catch (error) {
      throw error;
    }
  }

  async deleteSoal(id: number) {
    try {
      const deletedSoal = await this.soalRepository.destroy({
        where: { id_soal: id },
      });
      return deletedSoal;
    } catch (error) {
      throw error;
    }
  }
}

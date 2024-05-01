import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { MateriModel } from 'src/models/materi.entity';

@Injectable()
export class MateriService {
  constructor(
    @Inject('MATERI_REPOSITORY')
    private readonly materiRepository: typeof MateriModel,
  ) {}

  async getAllMateri() {
    try {
      const Materi = await this.materiRepository.sequelize.query(
        `SELECT * FROM e_materi`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );

      return Materi;
    } catch (error) {
      throw error;
    }
  }

  async getMateriById(id: number) {
    try {
      const materi = await this.materiRepository.findOne({
        where: { id_materi: id },
      });

      return materi;
    } catch (error) {
      throw new error();
    }
  }

  async createMateri(materi: any) {
    try {
      const createdMateri = await this.materiRepository.create(materi);

      return createdMateri;
    } catch (error) {
      throw error;
    }
  }

  async updateMateri(id: number, body: any) {
    try {
      const updatedMateri = await this.materiRepository.update(body, {
        where: { id_materi: id },
      });

      return updatedMateri;
    } catch (error) {
      throw new error();
    }
  }

  async deleteMateri(id: number) {
    try {
      const deletedMateri = await this.materiRepository.destroy({
        where: { id_materi: id },
      });
      return deletedMateri;
    } catch (error) {
      throw error;
    }
  }
}

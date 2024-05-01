import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { PembayaranModel } from 'src/models/buktipembayaran.entity';

@Injectable()
export class BuktiPembayaranService {
  constructor(
    @Inject('PEMBAYARAN_REPOSITORY')
    private readonly pembayaranRepository: typeof PembayaranModel,
  ) {}

  async getAllPembayaran() {
    try {
      const pembayaran = await this.pembayaranRepository.sequelize.query(
        `SELECT e_user.id_user, e_pembayaran.id_pembayaran, e_user.nama_lengkap, e_pembayaran.status, e_pembayaran.file 
        FROM e_pembayaran 
        JOIN e_user ON e_user.id_user = e_pembayaran.id_user`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );

      return pembayaran;
    } catch (error) {
      return error;
    }
  }

  async createPembayaran(pembayaran: any): Promise<PembayaranModel> {
    try {
      const createdPembayaran =
        await this.pembayaranRepository.create(pembayaran);

      return createdPembayaran;
    } catch (error) {
      throw error;
    }
  }

  async getPembayaranById(id: number) {
    try {
      const pembayaran = await this.pembayaranRepository.findOne({
        where: { id_pembayaran: id },
      });
      return pembayaran;
    } catch (error) {
      throw error;
    }
  }

  async updatePembayaran(id: number, body: any) {
    try {
      const updatedPembayaran = await this.pembayaranRepository.update(body, {
        where: { id_pembayaran: id },
      });
      return updatedPembayaran;
    } catch (error) {
      throw error;
    }
  }

  async deletePembayaran(id: number) {
    try {
      const deletedPembayaran = await this.pembayaranRepository.destroy({
        where: { id_pembayaran: id },
      });
      return deletedPembayaran;
    } catch (error) {
      throw error;
    }
  }
}

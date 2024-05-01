import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthModel } from 'src/models/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/dto/auth.dto';
import { PembayaranModel } from 'src/models/buktipembayaran.entity';
import sequelize from 'sequelize';
import { MateriModel } from 'src/models/materi.entity';
import { SoalModel } from 'src/models/soal.entity';
import { MapelModel } from 'src/models/mapel.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: typeof AuthModel,
    @Inject('PEMBAYARAN_REPOSITORY')
    private readonly pembayaranRepository: typeof PembayaranModel,
    @Inject('MAPEL_REPOSITORY')
    private readonly mapelRepository: typeof MapelModel,
    @Inject('MATERI_REPOSITORY')
    private readonly materiRepository: typeof MateriModel,
    @Inject('SOAL_REPOSITORY')
    private readonly soalRepository: typeof SoalModel,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUser() {
    try {
      const user = await this.authRepository.sequelize.query(
        `select 
        e_user.id_user, 
        e_user.nama_lengkap, 
        e_user.nis,
        e_user.no_handphone, 
        e_user.email, 
        e_user.tingkat_pendidikan, 
        e_user.gender, 
        e_user.role, 
        e_user.username,
        e_pembayaran.id_pembayaran,
        e_pembayaran.status,
        e_pembayaran.file
      from 
        e_user LEFT JOIN e_pembayaran ON e_user.id_user = e_pembayaran.id_user`,
      );

      return user;
    } catch (error) {
      throw new error();
    }
  }

  async getUserById(id: number): Promise<AuthModel> {
    try {
      const user = await this.authRepository.findOne({
        where: { id_user: id },
      });
      return user;
    } catch (error) {
      throw new error();
    }
  }

  async getPembayaranById(iduser) {
    try {
      const id = iduser.id_user;
      const [pembayaran] = await this.pembayaranRepository.sequelize.query(
        `select file from e_pembayaran where id_user = ${id}`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );
      if (pembayaran) {
        return pembayaran;
      }
      return null;
    } catch (error) {
      throw new error();
    }
  }

  async getAllMapelByIdUser(user): Promise<any[] | null> {
    const tingkat_pendidikan = user.tingkat_pendidikan;
    if (!tingkat_pendidikan) {
      return null;
    }
    try {
      const [mapel] = await this.mapelRepository.sequelize.query(
        `SELECT 
          e_mapel.id_mapel, 
          e_mapel.mapel 
        FROM 
          e_mapel 
        WHERE 
          tingkat_pendidikan = '${tingkat_pendidikan}'`,
      );
      return mapel || null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getMateri(mapel): Promise<any[] | null> {
    try {
      if (!mapel || mapel.length === 0) {
        return null;
      }
      const id = mapel[0].id_mapel;
      const materi = await this.materiRepository.sequelize.query(
        `select id_materi, materi, file from e_materi where id_mapel = ${id}`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );
      return materi || null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSoal(materi): Promise<any[] | null> {
    try {
      if (!materi || materi.length === 0) {
        return null;
      }
      const id = materi[0].id_materi;
      const soal = await this.soalRepository.sequelize.query(
        `select id_soal, soal from e_soal where id_materi = ${id}`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );
      return soal || null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async registerUser(
    userData,
  ): Promise<{ user: AuthModel; accessToken: string }> {
    const {
      nama_lengkap,
      nis,
      no_handphone,
      tingkat_pendidikan,
      mapel,
      gender,
      email,
      bukti_pembayaran,
      role,
      username,
      password,
      created_by,
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.authRepository.create<AuthModel>({
      nama_lengkap,
      nis,
      no_handphone,
      tingkat_pendidikan,
      mapel,
      gender,
      email,
      bukti_pembayaran,
      role,
      username,
      password: hashedPassword,
      created_by,
    });

    const accessToken = this.generateAccessToken(user);

    return { user, accessToken };
  }

  updateUser(id: number, body: any): Promise<[affectedCount: number]> {
    return this.authRepository.update(body, {
      where: { id_user: id },
    });
  }

  async loginUser(
    loginDTO: LoginDTO,
  ): Promise<{ user: AuthModel; accessToken: string } | null> {
    const { username, password } = loginDTO;
    const user = await this.validateUser(username, password);
    if (!user) {
      return null;
    }
    const accessToken = this.generateAccessToken(user);
    return { user, accessToken };
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<AuthModel | null> {
    const user = await AuthModel.findOne({ where: { username } });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  private generateAccessToken(user: AuthModel): string {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async deleteUser(id: number): Promise<number> {
    try {
      return this.authRepository.destroy({
        where: { id_user: id },
      });
    } catch (error) {
      throw new error();
    }
  }
}

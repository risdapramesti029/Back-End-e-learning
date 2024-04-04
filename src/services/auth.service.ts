import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthModel } from 'src/models/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: typeof AuthModel,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUser(): Promise<AuthModel[]> {
    return this.authRepository.findAll();
  }

  async getUserById(id: number): Promise<AuthModel> {
    const user = await this.authRepository.findOne({ where: { id_user: id } });
    return user;
  }

  async registerUser(
    userData,
  ): Promise<{ user: AuthModel; accessToken: string }> {
    const {
      nama_lengkap,
      tingkat_pendidikan,
      email,
      bukti_pembayaran,
      username,
      password,
      created_by,
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.authRepository.create<AuthModel>({
      nama_lengkap,
      tingkat_pendidikan,
      email,
      bukti_pembayaran,
      username,
      password: hashedPassword,
      created_by,
    });

    const accessToken = this.generateAccessToken(user);

    return { user, accessToken };
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
}

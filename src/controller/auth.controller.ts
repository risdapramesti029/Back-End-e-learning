import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDTO, registerUserDTO, updateUserDTO } from 'src/dto/auth.dto';
import { ResponseHelper } from 'src/helpers/response.helpers';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Get('/list')
  async getAllUser(@Res() res) {
    try {
      const [user] = await this.authService.getAllUser();
      return this.responseHelper.responseSuccessData(
        res,
        201,
        'Berhasil Mendapatkan data user',
        user,
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Get('/:id')
  async getUserById(@Res() res, @Param('id') id) {
    try {
      const user = await this.authService.getUserById(id);
      if (!user) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `User dengan id ${id} tidak ditemukan`,
        );
      }
      const pembayaran = await this.authService.getPembayaranById(user);
      const mapel = await this.authService.getAllMapelByIdUser(user);
      const materi = await this.authService.getMateri(mapel);
      const soal = await this.authService.getSoal(materi);
      return this.responseHelper.responseSuccessData(
        res,
        201,
        `Berhasil Mendapatkan user dengan id ${id}`,
        { user, pembayaran, mapel, materi, soal },
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(res);
    }
  }

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async registerUser(@Body() users: registerUserDTO, @Res() res) {
    try {
      const { user, accessToken } = await this.authService.registerUser(users);
      return this.responseHelper.responseSuccessData(
        res,
        201,
        'user berhasil Registrasi',
        { user, accessToken },
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields.email) {
          return this.responseHelper.responseClientError(
            res,
            400,
            'Email sudah terdaftar',
          );
        }
        if (error.fields.username) {
          return this.responseHelper.responseClientError(
            res,
            400,
            'Username sudah terdaftar',
          );
        }
      }
      if (error.message.includes('foreign key constraint fails')) {
        const tableName = error.table || 'UnknownTable';

        return this.responseHelper.responseClientError(
          res,
          404,
          `Data ${tableName} with that id is not valid`,
        );
      } else {
        if (error.message === 'validation error: Validation failed') {
          return this.responseHelper.responseClientError(
            res,
            400,
            'Validation error',
          );
        }
        return this.responseHelper.responseServerError(res);
      }
    }
  }

  @Put('/:id')
  async updateUser(@Res() res, @Param('id') id, @Body() body: updateUserDTO) {
    try {
      const user = await this.authService.getUserById(id);
      if (!user) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `User dengan ${id} tidak ditemukan`,
        );
      }
      await this.authService.updateUser(id, body);
      return this.responseHelper.responseSuccess(
        res,
        200,
        `Berhasil Update user dengan id ${id}`,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(error);
    }
  }

  @Post('/login')
  async loginUser(@Body() loginDTO: LoginDTO, @Res() res) {
    const { user, accessToken } = await this.authService.loginUser(loginDTO);
    if (accessToken) {
      return this.responseHelper.responseSuccessData(
        res,
        201,
        'Berhasil Login',
        { user, accessToken },
      );
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() res, @Param('id') id) {
    try {
      const user = await this.authService.getUserById(id);
      if (!user) {
        return this.responseHelper.responseClientError(
          res,
          404,
          `User dengan ${id} tidak ditemukan`,
        );
      }
      await this.authService.deleteUser(id);
      return this.responseHelper.responseSuccess(
        res,
        200,
        `Berhasil Delete user dengan id ${id}`,
      );
    } catch (error) {
      console.log(error);
      return this.responseHelper.responseServerError(error);
    }
  }
}

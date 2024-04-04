import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDTO, registerUserDTO } from 'src/dto/auth.dto';
import { ResponseHelper } from 'src/helpers/response.helpers';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Get('/user')
  async getAllUser(@Res() res) {
    try {
      const user = await this.authService.getAllUser();
      return this.responseHelper.responseSuccessData(
        res,
        201,
        'Data semua user berhasil diambil',
        user,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(error);
    }
  }

  @Get('/:id')
  async getUserById(@Res() res, @Param('id') id) {
    try {
      const user = await this.authService.getUserById(id);
      return this.responseHelper.responseSuccessData(
        res,
        201,
        'Data user berhasil diambil',
        user,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(error);
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
}

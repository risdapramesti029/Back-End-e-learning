import { IsNotEmpty, IsString } from 'class-validator';

export class userDTO {
  @IsString()
  nama_lengkap: string;

  @IsString()
  tingkat_pendidikan: string;

  @IsString()
  email: string;

  @IsString()
  bukti_pembayaran: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class registerUserDTO extends userDTO {
  @IsNotEmpty()
  @IsString()
  created_by: string;
}

export class LoginDTO extends userDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class updateHolidayDTO extends userDTO {
  @IsNotEmpty()
  @IsString()
  updated_by: string;
}

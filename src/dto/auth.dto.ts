import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class userDTO {
  @IsString()
  nama_lengkap: string;

  @IsNumber()
  no_handphone: number;

  @IsString()
  tingkat_pendidikan: string;

  @IsOptional()
  mapel: string;

  @IsString()
  gender: string;

  @IsString()
  email: string;

  @IsOptional()
  bukti_pembayaran: string;

  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  role: string;

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

export class updateUserDTO extends userDTO {
  @IsNotEmpty()
  @IsString()
  updated_by: string;
}

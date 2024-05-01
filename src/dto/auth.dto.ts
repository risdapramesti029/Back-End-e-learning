import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class userDTO {
  nama_lengkap: string;

  nis: string;

  no_handphone: number;

  tingkat_pendidikan: string;

  mapel: string;

  gender: string;

  email: string;

  bukti_pembayaran: string;

  username: string;

  role: string;

  password: string;
}

export class registerUserDTO extends userDTO {
  created_by: string;
}

export class LoginDTO extends userDTO {
  username: string;

  password: string;
}

export class updateUserDTO extends userDTO {
  updated_by: string;
}

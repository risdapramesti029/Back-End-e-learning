import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PembayaranDTO {
  id_user: number;

  file: string;
}

export class createdPembayaranDTO extends PembayaranDTO {
  @IsNotEmpty()
  @IsString()
  created_by: string;
}

export class updatePembayaranDTO extends PembayaranDTO {
  status: string;

  @IsNotEmpty()
  @IsString()
  updated_by: string;
}

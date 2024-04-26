import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SoalDTO {
  @IsNumber()
  id_materi: number;

  @IsString()
  soal: string;
}

export class createSoalDTO extends SoalDTO {
  @IsNotEmpty()
  @IsString()
  created_by: string;
}

export class updateSoalDTO extends SoalDTO {
  @IsNotEmpty()
  @IsString()
  updated_by: string;
}

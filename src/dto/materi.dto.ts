import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MateriDTO {
  @IsNotEmpty()
  // @IsNumber()
  id_mapel: number;

  @IsString()
  materi: string;
}

export class createMateriDTO extends MateriDTO {
  @IsNotEmpty()
  @IsString()
  created_by: string;
}

export class updateMateriDTO extends MateriDTO {
  @IsNotEmpty()
  @IsString()
  updated_by: string;
}

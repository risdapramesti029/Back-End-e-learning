import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MapelDTO {
  @IsString()
  mapel: string;

  @IsString()
  tingkat_pendidikan: string;
}

export class createMapelDTO extends MapelDTO {
  @IsNotEmpty()
  @IsString()
  created_by: string;
}

export class updateMapelDTO extends MapelDTO {
  @IsNotEmpty()
  @IsString()
  updated_by: string;
}

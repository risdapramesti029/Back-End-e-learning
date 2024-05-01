import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'e_mapel' })
export class MapelModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id_mapel: number;

  @Column({
    type: DataType.CHAR(32),
  })
  mapel: string;

  @Column({
    type: DataType.CHAR(30),
  })
  tingkat_pendidikan: string;

  @Column({
    type: DataType.CHAR(32),
  })
  created_by: string;

  @Column({
    type: DataType.CHAR(32),
  })
  updated_by: string;
}

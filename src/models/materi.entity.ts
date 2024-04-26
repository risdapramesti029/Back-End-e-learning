import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { MapelModel } from './mapel.entity';

@Table({ tableName: 'e_materi' })
export class MateriModel extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id_materi: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_mapel: number;

  @Column({
    type: DataType.CHAR(255),
  })
  materi: string;

  @Column({
    type: DataType.TEXT(),
  })
  file: string;

  @Column({
    type: DataType.CHAR(32),
  })
  created_by: string;

  @Column({
    type: DataType.CHAR(32),
  })
  updated_by: string;
}

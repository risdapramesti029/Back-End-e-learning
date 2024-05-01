import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'e_user' })
export class AuthModel extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id_user: number;

  @Column({
    type: DataType.CHAR(255),
  })
  nis: string;

  @Column({
    type: DataType.CHAR(255),
    allowNull: false,
    unique: true,
  })
  nama_lengkap: string;

  @Column({
    type: DataType.BIGINT,
  })
  no_handphone: number;

  @Column({
    type: DataType.CHAR(64),
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.CHAR(30),
  })
  tingkat_pendidikan: string;

  @Column({
    type: DataType.CHAR(10),
  })
  gender: string;

  @Column({
    allowNull: true,
    type: DataType.CHAR(255),
  })
  role: string;

  @Column({
    type: DataType.CHAR(255),
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.CHAR(255),
  })
  password: string;

  @Column({
    type: DataType.CHAR(32),
  })
  created_by: string;

  @Column({
    type: DataType.CHAR(32),
  })
  updated_by: string;
}

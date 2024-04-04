import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
  nama_lengkap: string;

  @Column({
    type: DataType.CHAR(255),
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.CHAR(255),
  })
  tingkat_pendidikan: string;

  @Column({
    type: DataType.CHAR(255),
    defaultValue: 'siswa',
  })
  role: string;

  @Column({
    type: DataType.CHAR(255),
  })
  bukti_pembayaran: string;

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

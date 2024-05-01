import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'e_pembayaran' })
export class PembayaranModel extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id_pembayaran: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_user: number;

  @Column({
    type: DataType.CHAR(255),
  })
  file: string;

  @Column({
    type: DataType.CHAR(255),
    defaultValue: 'Menunggu Konfirmasi',
  })
  status: string;

  @Column({
    type: DataType.CHAR(32),
  })
  created_by: string;

  @Column({
    type: DataType.CHAR(32),
  })
  updated_by: string;
}

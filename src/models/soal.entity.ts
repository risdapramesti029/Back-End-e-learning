import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { MateriModel } from './materi.entity';

@Table({ tableName: 'e_soal' })
export class SoalModel extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id_soal: number;

  // @ForeignKey(() => MateriModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_materi: number;

  // @BelongsTo(() => MateriModel)
  // materiModel: MateriModel;

  @Column({
    type: DataType.CHAR(255),
    unique: true,
  })
  soal: string;
}

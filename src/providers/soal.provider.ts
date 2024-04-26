import { SoalModel } from 'src/models/soal.entity';

export const soalProviders = [
  {
    provide: 'SOAL_REPOSITORY',
    useValue: SoalModel,
  },
];

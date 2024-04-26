import { MateriModel } from 'src/models/materi.entity';

export const materiProviders = [
  {
    provide: 'MATERI_REPOSITORY',
    useValue: MateriModel,
  },
];

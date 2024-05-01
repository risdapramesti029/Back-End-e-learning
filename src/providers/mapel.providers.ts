import { MapelModel } from 'src/models/mapel.entity';

export const mapelProviders = [
  {
    provide: 'MAPEL_REPOSITORY',
    useValue: MapelModel,
  },
];

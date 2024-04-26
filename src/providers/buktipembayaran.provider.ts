import { PembayaranModel } from 'src/models/buktipembayaran.entity';

export const pembayaranProviders = [
  {
    provide: 'PEMBAYARAN_REPOSITORY',
    useValue: PembayaranModel,
  },
];

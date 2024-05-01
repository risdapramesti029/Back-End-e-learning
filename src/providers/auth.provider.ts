import { AuthModel } from 'src/models/auth.entity';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: AuthModel,
  },
];

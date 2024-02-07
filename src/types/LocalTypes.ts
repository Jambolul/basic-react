import { User } from './DBTypes';
export type Credentials = Pick<User, 'username' | 'password'>;

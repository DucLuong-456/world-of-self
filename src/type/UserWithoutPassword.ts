import { User } from '@entities/User';
import { OmitType } from '@nestjs/swagger';

export class UserWithoutPassword extends OmitType(User, [
  'password',
] as const) {}

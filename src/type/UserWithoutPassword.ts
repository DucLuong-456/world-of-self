import { User } from '@entities/src/entities/User';
import { OmitType } from '@nestjs/swagger';

export class UserWithoutPassword extends OmitType(User, [
  'password',
] as const) {}
